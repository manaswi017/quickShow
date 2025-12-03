import mongoose from "mongoose";

const movieSchema=new mongoose.Schema(
    {
        _id: {type: String, required: true},
        title: {type: String, required: true},
        overview: {type: String, required: true},
        poster_path: {type: String, required: true},
        backdrop_path: {type: String, required: true},
        release_date: {type: String, required: true},
        original_language: {type: String, required: true},
        tagline: {type: String},
        genres: {type: Array, required: true},
        casts: {type: Array, required: true},
        vote_average: {type: Number, required: true},
        runtime: {type: Number, required: true},
    }, {timestamps: true} //this timestamps: true means that whenevr a movie is created it records and stores that time
)

const Movie=mongoose.model('Movie', movieSchema)

export default Movie;