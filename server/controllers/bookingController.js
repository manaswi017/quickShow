import Booking from "../models/Booking.js";
import Shows from "../models/Shows.js"
import stripe from 'stripe';


// function to check availabiltiy of selected seats from movie
const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const showData=await Shows.findById(showId);
        if (!showData) return false;

        const occupiedSeats=showData.occupiedSeats;

        const isAnySeatTaken=selectedSeats.some(seat=>occupiedSeats[seat]);
        return !isAnySeatTaken
    } catch (error){
        console.log(error,message);
        return false;
    }
}

export const createBookings = async (req, res) => {
    try {
        const {userId}=req.auth();
        const {showId, selectedSeats}=req.body;
        // frontend url thru headers
        const {origin}=req.headers;

        // check if sseat is available 
        const isAvailable=await checkSeatsAvailability(showId, selectedSeats);
        if (!isAvailable){
            return res.json({success: false, message: "Selected seats are not available"});
        }
        // proceed to create booking
        const showData=await Shows.findById(showId).populate('movie');
        // create new booking in Booking collection
        const booking= await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats,
            bookingTime: new Date(),
        });
        // mark seats as occupied in Shows collection
        selectedSeats.map(()=>{
            showData.occupiedSeats[seat]=true;
        })

        showData.markModified('occupiedSeats');

        await showData.save();

        // stripe gateway initilize
        const stripeInstance=new stripe(process.env.STRIPE_SECRET_KEY);
        // line itenms creation for stripe checkout
        const lineItems=[{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: showData.movie.title
                },
                unit_amount: Math.floor(booking.amount)*100
            },
            quantity: 1,
        }];

        const session=await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-bookings`,
            cancel_url: `${origin}/my-bookings`,  //when payment fails or cancelled redirect here
            line_items: lineItems,
            mode: 'payment',
            metadata: {
                bookingId: booking._id.toString(),
            },
            expires_at: Math.floor(Date.now()/1000)+30*60, // session expires in 30 mins
        })

        // session will give payment link
        booking.paymentLink=session.url;
        await booking.save();

        // run inngest schedulkar function to check payment status after 10 mins
        await inngest.send({
            name: 'app/checkpayment',
            data: {bookingId: booking._id.toString()}
        })

        res.json({success: true, url: session.url});
    } catch (error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
};

export const getOccupiedSeats=async (req, res)=>{
    try {
        const {showId}=req.params;
        const showData=await Shows.findById(showId);

        const occupiedSeats=Object.keys(showData.occupiedSeats);

        res.json({success: true, occupiedSeats});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}