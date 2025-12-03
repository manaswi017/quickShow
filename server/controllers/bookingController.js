import Booking from "../models/Booking.js";
import Shows from "../models/Shows.js"


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

        res.json({success: true, message: "Booking created successfully", bookingId: booking._id});
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