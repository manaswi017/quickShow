import mongoose from 'mongoose';
import 'dotenv/config';
import Movie from './models/Movie.js';

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/quickShow`);
        console.log('Database connected');
    } catch (error) {
        console.log(error.message);
    }
}

const fixImages = async () => {
    await connectDB();
    
    try {
        const movies = await Movie.find({});
        console.log(`Found ${movies.length} movies to fix`);
        
        for (let movie of movies) {
            let updated = false;
            
            // Fix poster_path if it doesn't start with http
            if (movie.poster_path && !movie.poster_path.startsWith('http')) {
                movie.poster_path = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                updated = true;
            }
            
            // Fix backdrop_path if it doesn't start with http
            if (movie.backdrop_path && !movie.backdrop_path.startsWith('http')) {
                movie.backdrop_path = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
                updated = true;
            }
            
            if (updated) {
                await movie.save();
                console.log(`✓ Fixed: ${movie.title}`);
                console.log(`  Poster: ${movie.poster_path}`);
                console.log(`  Backdrop: ${movie.backdrop_path}`);
            }
        }
        
        console.log('\n✓ All movies fixed!');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing images:', error.message);
        process.exit(1);
    }
}

fixImages();