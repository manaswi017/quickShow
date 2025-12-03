import mongoose from "mongoose";

const showsSchema=new mongoose.Schema(
    {
        movie: {type: String, required: true, ref: 'Movie'},
        showDateTime: {type: Date, required: true},
        showPrice: {type: Number, required: true},
        occupiedSeats: {type: Object, default: {}}
    }, {minimize: false} //creates the show data with an empty objet also (occupiedSeats)
)

const Shows=mongoose.model('Shows', showsSchema);

export default Shows;