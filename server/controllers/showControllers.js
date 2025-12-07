import axios from "axios";
import Movie from "../models/Movie.js";
import Shows from "../models/Shows.js";

// this function is an api endpoint handler when someone visits /api/movies/now-playing 
// api to get now playing movies from TMDB
// export const getNowPlayingMovies = async (req, res) => {
//     try {
//         const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
//             headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
//         })
//         const movies = data.results;
//         res.json({ success: true, movies: movies })
//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message })
//     }
// }
// When fetching movies, ensure proper image URLs
export const getNowPlayingMovies = async (req, res) => {
    try {
        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
        })
        
        // Add full image URLs to each movie
        const movies = data.results.map(movie => ({
            ...movie,
            poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
            backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null
        }));
        
        console.log("First movie poster:", movies[0]?.poster_path); // Debug log
        
        res.json({ success: true, movies: movies })
    } catch (error) {
        console.error("Error in getNowPlayingMovies:", error.message);
        res.json({ success: false, message: error.message })
    }
}


// API to add a new show to db
// export const addShow = async (req, res) => {
//     try {
//         console.log("Request Body:", req.body);

//         const { movieId, showInput, showPrice } = req.body;
//         console.log("SHOW INPUT RECEIVED:", JSON.stringify(showInput, null, 2));

//         // Validation
//         if (!movieId || !showInput || !Array.isArray(showInput) || showInput.length === 0 || !showPrice) {
//             return res.status(400).json({ success: false, message: "Missing or invalid required fields" });
//         }

//         // Check if movie exists in DB, if not fetch from TMDB
//         let movie = await Movie.findById(movieId);

//         if (!movie) {
//             const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
//                 axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
//                     headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
//                 }),
//                 axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
//                     headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
//                 })
//             ]);

//             const movieApiData = movieDetailsResponse.data;
//             const movieApiCredits = movieCreditsResponse.data;

//             movie = await Movie.create({
//                 _id: movieId,
//                 title: movieApiData.title,
//                 overview: movieApiData.overview,
//                 poster_path: movieApiData.poster_path,
//                 backdrop_path: movieApiData.backdrop_path,
//                 genres: movieApiData.genres,
//                 casts: movieApiCredits.cast,
//                 release_date: movieApiData.release_date,
//                 original_language: movieApiData.original_language,
//                 tagline: movieApiData.tagline || "",
//                 vote_average: movieApiData.vote_average,
//                 runtime: movieApiData.runtime
//             });
//         }

//         const showsToCreate = [];

//         showInput.forEach(show => {
//             const showDate = show.date;
            
//             if (!Array.isArray(show.time)) {
//                 throw new Error(`Invalid time format for date ${showDate}`);
//             }

//             show.time.forEach(time => {
//                 // Ensure time is in HH:MM format
//                 const dateTimeString = `${showDate}T${time}:00`;
//                 const parsedDate = new Date(dateTimeString);
                
//                 console.log("DATE:", showDate, "TIME:", time, "PARSED:", parsedDate);

//                 if (isNaN(parsedDate.getTime())) {
//                     throw new Error(`Invalid date-time: ${dateTimeString}`);
//                 }

//                 showsToCreate.push({
//                     movie: movie._id,
//                     showDateTime: parsedDate,
//                     showPrice: Number(showPrice),
//                     occupiedSeats: {}
//                 });
//             });
//         });

//         if (showsToCreate.length > 0) {
//             const inserted = await Shows.insertMany(showsToCreate);
//             res.json({ success: true, message: `${inserted.length} show(s) added successfully` });
//         } else {
//             res.status(400).json({ success: false, message: "No valid shows to create" });
//         }

//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// Helper function to make API calls with retry
const fetchWithRetry = async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(url, options);
            return response;
        } catch (error) {
            console.log(`Attempt ${i + 1} failed:`, error.message);
            if (i === retries - 1) throw error;
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
};

export const addShow = async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const { movieId, showInput, showPrice } = req.body;
        console.log("SHOW INPUT RECEIVED:", JSON.stringify(showInput, null, 2));

        // Validation
        if (!movieId || !showInput || !Array.isArray(showInput) || showInput.length === 0 || !showPrice) {
            return res.status(400).json({ success: false, message: "Missing or invalid required fields" });
        }

        // Check if movie exists in DB, if not fetch from TMDB
        let movie = await Movie.findById(movieId);

        if (!movie) {
            console.log(`Movie ${movieId} not found in DB, fetching from TMDB...`);
            
            try {
                // Use retry logic for API calls
                const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                    fetchWithRetry(
                        `https://api.themoviedb.org/3/movie/${movieId}`,
                        { headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` } }
                    ),
                    fetchWithRetry(
                        `https://api.themoviedb.org/3/movie/${movieId}/credits`,
                        { headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` } }
                    )
                ]);

                const movieApiData = movieDetailsResponse.data;
                const movieApiCredits = movieCreditsResponse.data;

                console.log(`Successfully fetched movie: ${movieApiData.title}`);

                // Add full image URLs when creating movie
                movie = await Movie.create({
                    _id: movieId,
                    title: movieApiData.title,
                    overview: movieApiData.overview,
                    poster_path: movieApiData.poster_path ? `https://image.tmdb.org/t/p/w500${movieApiData.poster_path}` : "",
                    backdrop_path: movieApiData.backdrop_path ? `https://image.tmdb.org/t/p/original${movieApiData.backdrop_path}` : "",
                    genres: movieApiData.genres,
                    casts: movieApiCredits.cast,
                    release_date: movieApiData.release_date,
                    original_language: movieApiData.original_language,
                    tagline: movieApiData.tagline || "",
                    vote_average: movieApiData.vote_average,
                    runtime: movieApiData.runtime
                });
                
                console.log("Movie created with poster:", movie.poster_path);
            } catch (apiError) {
                console.error("TMDB API Error:", apiError.message);
                return res.status(500).json({ 
                    success: false, 
                    message: `Failed to fetch movie from TMDB: ${apiError.message}. Please try again.`
                });
            }
        } else {
            console.log(`Movie ${movieId} found in DB: ${movie.title}`);
        }

        const showsToCreate = [];

        showInput.forEach(show => {
            const showDate = show.date;
            
            if (!Array.isArray(show.time)) {
                throw new Error(`Invalid time format for date ${showDate}`);
            }

            show.time.forEach(time => {
                // Ensure time is in HH:MM format
                const dateTimeString = `${showDate}T${time}:00`;
                const parsedDate = new Date(dateTimeString);
                
                console.log("DATE:", showDate, "TIME:", time, "PARSED:", parsedDate);

                if (isNaN(parsedDate.getTime())) {
                    throw new Error(`Invalid date-time: ${dateTimeString}`);
                }

                showsToCreate.push({
                    movie: movie._id,
                    showDateTime: parsedDate,
                    showPrice: Number(showPrice),
                    occupiedSeats: {}
                });
            });
        });

        if (showsToCreate.length > 0) {
            const inserted = await Shows.insertMany(showsToCreate);
            console.log(`✓ Successfully added ${inserted.length} show(s)`);
            res.json({ success: true, message: `${inserted.length} show(s) added successfully` });
        } else {
            res.status(400).json({ success: false, message: "No valid shows to create" });
        }

    } catch (error) {
        console.error("Error in addShow:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// api to get all shows from db
// export const getShows = async (req, res) => {
//     try {
//         const shows = await Shows.find({ showDateTime: { $gte: new Date() } }).populate('movie').sort({ showDateTime: 1 });
        
//         // Get unique movies
//         const uniqueMovies = new Map();
//         shows.forEach(show => {
//             if (show.movie && !uniqueMovies.has(show.movie._id.toString())) {
//                 uniqueMovies.set(show.movie._id.toString(), show.movie);
//             }
//         });

//         res.json({ success: true, shows: Array.from(uniqueMovies.values()) });
//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// }

export const getShows = async (req, res) => {
    try {
        const shows = await Shows.find({ showDateTime: { $gte: new Date() } })
            .populate('movie')
            .sort({ showDateTime: 1 });
        
        // Get unique movies
        const uniqueMovies = new Map();
        shows.forEach(show => {
            if (show.movie && !uniqueMovies.has(show.movie._id.toString())) {
                // Ensure image URLs are complete
                const movie = show.movie.toObject();
                if (movie.poster_path && !movie.poster_path.startsWith('http')) {
                    movie.poster_path = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                }
                if (movie.backdrop_path && !movie.backdrop_path.startsWith('http')) {
                    movie.backdrop_path = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
                }
                uniqueMovies.set(movie._id.toString(), movie);
            }
        });

        console.log("Sending movies:", Array.from(uniqueMovies.values()).length); // Debug log
        res.json({ success: true, shows: Array.from(uniqueMovies.values()) });
    } catch (error) {
        console.error("Error in getShows:", error);
        res.json({ success: false, message: error.message });
    }
}



// api to get single show by id
// export const getShow = async (req, res) => {
//     try {
//         const { movieId } = req.params;
//         const shows = await Shows.find({ movie: movieId, showDateTime: { $gte: new Date() } });
//         const movie = await Movie.findById(movieId);

//         if (!movie) {
//             return res.status(404).json({ success: false, message: "Movie not found" });
//         }

//         const dateTime = {};
//         shows.forEach((s) => {
//             const date = s.showDateTime.toISOString().split('T')[0];
//             if (!dateTime[date]) {
//                 dateTime[date] = [];
//             }
//             dateTime[date].push({ time: s.showDateTime, showId: s._id });
//             console.log("SHOW DATETIME:", s.showDateTime);
//         })

//         res.json({ success: true, movie, showTimes: dateTime });
//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// }

// api to get single show by id
export const getShow = async (req, res) => {
    try {
        const { movieId } = req.params;
        const shows = await Shows.find({ 
            movie: movieId, 
            showDateTime: { $gte: new Date() } 
        }).sort({ showDateTime: 1 });
        
        const movie = await Movie.findById(movieId);

        if (!movie) {
            return res.status(404).json({ success: false, message: "Movie not found" });
        }

        if (shows.length === 0) {
            return res.json({ 
                success: true, 
                movie, 
                showTimes: {},
                message: "No available shows for this movie" 
            });
        }

        const dateTime = {};
        shows.forEach((s) => {
            const date = s.showDateTime.toISOString().split('T')[0];
            if (!dateTime[date]) {
                dateTime[date] = [];
            }
            
            // FIXED: Format time properly as HH:MM (24-hour format)
            const hours = s.showDateTime.getHours().toString().padStart(2, '0');
            const minutes = s.showDateTime.getMinutes().toString().padStart(2, '0');
            const timeString = `${hours}:${minutes}`;
            
            dateTime[date].push({ 
                time: timeString, // Send formatted time string like "05:45"
                showId: s._id.toString(),
                showPrice: s.showPrice,
                showDateTime: s.showDateTime.toISOString() // Keep full datetime for reference
            });
        })

        console.log("Show times being sent:", JSON.stringify(dateTime, null, 2)); // Debug log

        res.json({ success: true, movie, showTimes: dateTime });
    } catch (error) {
        console.error("Error in getShow:", error);
        res.json({ success: false, message: error.message });
    }
}
