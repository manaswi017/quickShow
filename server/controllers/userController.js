// import Booking from "../models/Booking.js";
// import { clerkClient } from "@clerk/express";
// import Movie from "../models/Movie.js"

// // api to control user bookings
// export const getUserBookings = async (req, res) => {
//     try {
//         const { userId } = req.auth(); // Fixed: destructure userId
//         const bookings = await Booking.find({ user: userId }).populate({
//             path: "show",
//             populate: { path: "movie" }
//         }).sort({ createdAt: -1 });
//         res.json({ success: true, bookings });
//     } catch (error) {
//         console.error("Error in getUserBookings:", error.message);
//         res.json({ success: false, message: error.message });
//     }
// }

// // api to add favorite movie or remove it if added in clerk user metadata
// export const updateFavorite = async (req, res) => {
//     try {
//         const { movieId } = req.body;
//         const { userId } = req.auth(); // Fixed: destructure userId

//         // find user from clerk
//         const user = await clerkClient.users.getUser(userId);
        
//         // create a favorites array if not present
//         if (!user.privateMetadata.favorites) {
//             user.privateMetadata.favorites = [];
//         }
        
//         let updatedFavorites;
        
//         // movie not in fav just add it
//         if (!user.privateMetadata.favorites.includes(movieId)) {
//             updatedFavorites = [...user.privateMetadata.favorites, movieId];
//         } else {
//             // Fixed: properly filter out the movie
//             updatedFavorites = user.privateMetadata.favorites.filter(item => item !== movieId);
//         }
        
//         await clerkClient.users.updateUserMetadata(userId, {
//             privateMetadata: {
//                 ...user.privateMetadata,
//                 favorites: updatedFavorites
//             }
//         })

//         res.json({ 
//             success: true, 
//             message: "Favorites updated successfully",
//             favorites: updatedFavorites
//         })
//     } catch (error) {
//         console.error("Error in updateFavorite:", error.message);
//         res.json({ success: false, message: error.message });
//     }
// }

// // api to get favorite movies of user from clerk
// export const getFavoriteMovies = async (req, res) => {
//     try {
//         const { userId } = req.auth(); // Fixed: destructure userId
//         const user = await clerkClient.users.getUser(userId);
//         const favorites = user.privateMetadata.favorites || [];

//         // get movies from db
//         const movies = await Movie.find({ _id: { $in: favorites } });

//         res.json({ success: true, movies })
//     } catch (error) {
//         console.error("Error in getFavoriteMovies:", error.message);
//         res.json({ success: false, message: error.message });
//     }
// }

import Booking from "../models/Booking.js";
import { clerkClient } from "@clerk/express";
import Movie from "../models/Movie.js"

// api to control user bookings
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.auth.userId; // Changed: access as property, not function
        const bookings = await Booking.find({ user: userId }).populate({
            path: "show",
            populate: { path: "movie" }
        }).sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.error("Error in getUserBookings:", error.message);
        res.json({ success: false, message: error.message });
    }
}

// api to add favorite movie or remove it if added in clerk user metadata
export const updateFavorite = async (req, res) => {
    try {
        const { movieId } = req.body;
        const userId = req.auth.userId; // Changed: access as property, not function

        console.log("User ID:", userId, "Movie ID:", movieId); // Debug log

        // find user from clerk
        const user = await clerkClient.users.getUser(userId);
        
        // create a favorites array if not present
        if (!user.privateMetadata.favorites) {
            user.privateMetadata.favorites = [];
        }
        
        let updatedFavorites;
        
        // movie not in fav just add it
        if (!user.privateMetadata.favorites.includes(movieId)) {
            updatedFavorites = [...user.privateMetadata.favorites, movieId];
        } else {
            // Fixed: properly filter out the movie
            updatedFavorites = user.privateMetadata.favorites.filter(item => item !== movieId);
        }
        
        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: {
                ...user.privateMetadata,
                favorites: updatedFavorites
            }
        })

        res.json({ 
            success: true, 
            message: "Favorites updated successfully",
            favorites: updatedFavorites
        })
    } catch (error) {
        console.error("Error in updateFavorite:", error.message);
        res.json({ success: false, message: error.message });
    }
}

// api to get favorite movies of user from clerk
export const getFavoriteMovies = async (req, res) => {
    try {
        const userId = req.auth.userId; // Changed: access as property, not function
        const user = await clerkClient.users.getUser(userId);
        const favorites = user.privateMetadata.favorites || [];

        // get movies from db
        const movies = await Movie.find({ _id: { $in: favorites } });

        res.json({ success: true, movies })
    } catch (error) {
        console.error("Error in getFavoriteMovies:", error.message);
        res.json({ success: false, message: error.message });
    }
}