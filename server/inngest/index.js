import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
// import { use } from "react";
import sendEmail from "../configs/nodeMailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// inngest function to save user data to db
const syncUserCreation=inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    {event: 'clerk/user.created'},
    async ({event})=>{
        const {id, first_name, last_name, email_addresses, image_url}=event.data
        const userData={
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name+' '+last_name,
            image: image_url
        }
        // whenever a new user is create this line stores it in the db
        await User.create(userData);
    }
)

// inngest function to delete user data from db
const syncUserDeletion=inngest.createFunction(
    {id: 'delete-user-from-clerk'},
    {event: 'clerk/user.deleted'},
    async ({event})=>{
        const {id}=event.data
        await User.findByIdAndDelete(id);
    }
)

// inngest function to update user data from db
const syncUserUpdation=inngest.createFunction(
    {id: 'update-user-from-clerk'},
    {event: 'clerk/user.updated'},
    async ({event})=>{
        const {id, first_name, last_name, email_addresses, image_url}=event.data
        const userData={
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name+' '+last_name,
            image: image_url
        }
        await User.findByIdAndUpdate(id, userData);
    }
)

// inngetst to cancel booking and relese seats of show after 10 mins of boooking created if payment is not made
const releaseSeatsAndDeleteBooking=inngest.createFunction(
    {id: 'release-seats-and-delete-booking'},
    {event: 'app/checkpayment'},
    async ({event, step})=>{
        const tenMinutesLater=new Date(Date.now()+10*60*1000);
        await step.sleepUntil('wait-for-10-minutes', tenMinutesLater);
        await step.run('check-payment-status', async()=>{
            const {bookingId}=event.data.bookingId;
            const booking=await Booking.findById(bookingId)

            // id payment is not made within 10 mins delete booking and release seats
            if (!booking.isPaid){
                const show=await Show.findById(booking.show);
                booking.bookedSeats.forEach((seat)=>{
                    delete show.occupiedSeats[seat];
                });
                show.markModified('occupiedSeats');
                await show.save();
                await Booking.findByIdAndDelete(booking._id);
            }
    })
})

// inngest funtion to send email when user books 
const sendBookingConfirmationEmail=inngest.createFunction(
    {id: "send-booking-confirmation-email"},
    {event: "app/show.booked"},
    async ({event, step})=>{
        const {bookingId}=event.data;
        const booking=await Booking.findById(bookingId).populate('user').populate({
            path: 'show',
            populate: {path: 'movie', model: 'Movie'}
        }).populate ('user');

        await sendEmail({
            to: booking.user.email,
            subject: `Payment Confirmation: "${booking.amount} for ${booking.show.movie.title}" booked!`,
            body: `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h2>Hi ${booking.user.name},</h2>
                    <p>Thank you for your payment of <strong>$${booking.amount}</strong> for the movie <strong>${booking.show.movie.title}</strong>.</p>
                    <p>Your booking details are as follows:</p>
                    <strong>Show Date & Time:</strong> ${new Date(booking.show.showDateTime).toLocaleString()}<br/>
                    <strong>Booked Seats:</strong> ${booking.bookedSeats.join(', ')}<br/>
                    <strong>Booking ID:</strong> ${booking._id}<br/>
                    <p>We look forward to seeing you at the show!</p>
                    <br/>
                    <p>Best regards,<br/>QuickShow Team</p>
                  </div>`
        })
    }
)

// ingest func to send reminders
// const sendShowReminders=inngest.createFunction(
//     {id: "send-show-reminders"},
//     {cron: '0 */8 * * *'}, // every 8 hours
//     async ({step})=>{
//         // find shows starting in next 8 hours
//         const now=new Date();
//         const in8Hours=new Date(now.getTime()+8*60*60*1000);
//         const windowStart=new Date(in8Hours.getTime()-10*60*1000); // 10 mins before showtime

//         // prepare reminder tadsk
//         const reminderTasks=await step.run('prepare-reminder-tasks', async()=>{
//             const shows=await Show.find({
//                 showTime: {$gte: windowStart, $lte: in8Hours}
//             }).populate('movie');

//             const tasks=[];
//             for (const show of shows){
//                 if (!show.movie || !show.occupiedSeats) continue;
//                 const userIds=[...new Set(Object.keys(show.occupiedSeats))];
//                 if (userIds.length===0) continue;

//                 const users=await User.find({_id: {$in: userIds}}).select('name email')
//                 for (const user of users){
//                     tasks.push({
//                         userEmail: user.email,
//                         userName: user.name,
//                         movieTitle: show.movie.title,
//                         showTime: show.showTime
//                     })
//                 }
//             }
//             return tasks;
//         })
//         if (reminderTasks.length===0) return {sent: 0, message: 'No reminders to send'};
//         // send reminders
//         const results=await step.run('send-all-reminders', async()=>{
//             return await Promise.allSettled(
//                 remainderTasks.map(task=>sendEmail({
//                     to: task.userEmail,
//                     subject: `Reminder: Upcoming Show for ${task.movieTitle}`,
//                     body: 
//                 })
//             )
//     }
// )

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation, releaseSeatsAndDeleteBooking, sendBookingConfirmationEmail];