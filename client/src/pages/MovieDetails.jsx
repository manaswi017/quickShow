// // import React, { useEffect, useState } from 'react'
// // import { useNavigate, useParams } from 'react-router-dom'
// // import { dummyDateTimeData, dummyShowsData } from '../assets/assets';
// // import BlurCircle from '../components/BlurCircle';
// // import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
// // import TimeFormat from '../lib/TimeFormat';
// // import DateSelect from '../components/DateSelect';
// // import MovieCard from '../components/MovieCard';
// // import Loading from '../components/Loading';
// // import { useAppContext } from '../context/AppContext';
// // import toast from 'react-hot-toast';

// // const MovieDetails = () => {

// //   const navigate=useNavigate();

// //   const {id}=useParams();
// //   const [show, setShow]=useState(null);

// //   const {shows, axios, getToken, user, fetchFavoriteMovies, favoriteMovies, image_base_url}=useAppContext();

// //   const getShow=async()=>{
// //     try {
// //       const {data}=await axios.get(`/api/show/${id}`)
// //       if (data.success){
// //         setShow(data)
// //       }
// //     } catch(error){
// //       console.log(error)
// //     }
// //   }

// //   const handleFavorite = async () => {
// //     try {
// //       if (!user) return toast.error("Please login to proceed");

// //       const { data } = await axios.post(
// //         '/api/user/update-favorite',
// //         { movieId: id },
// //         { headers: { Authorization: `Bearer ${await getToken()}` }}
// //       );

// //       if (data.success) {
// //         await fetchFavoriteMovies();    
// //         toast.success(data.message);
// //       }
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };

// //   useEffect(()=>{
// //       getShow();
// //     }, [id])

// //   return show ? (
// //     <div>
// //       <div className='px-6 md:px-16 lg:px-40 md:pt-50'>
// //         <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
// //           <img src={image_base_url + show.movie.poster_path} alt="" className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover'/>
// //           <div className='relative flex flex-col gap-3'>
// //             <BlurCircle top='-100px' left='-100px'/>
// //             <p className='text-primary'>ENGLISH</p>
// //             <h1 className='text-4xl font-semibold max-w-96 text-balance'>{show.movie.title}</h1>
// //             <div className='flex items-center gap-2 text-gray-300'>
// //               <StarIcon className='w-5 h-5 text-primary fill-primary'/>
// //               {show.movie.vote_average.toFixed(1)} User Rating
// //             </div>
// //             <p className='text-gray-400 mt-2 text-sm loading-tight max-w-xl'>{show.movie.overview}</p>
// //             <p>
// //               {TimeFormat(show.movie.runtime)} • {show.movie.genres.slice(0, 3).map(genre => genre.name).join(' | ') } • {show.movie.release_date.split('-')[0]}
// //             </p>
// //             <div className='flex items-center flex-wrap gap-4 mt-4'>
// //               <button className='flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95'>
// //                 <PlayCircleIcon className='w-5 h-5'/>
// //                 Watch Trailer
// //               </button>
// //               <a href="#dateSelect" className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95'>Buy Tickets</a>
// //               <button onClick={handleFavorite} className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95'>
// //                 <Heart 
// //                   className={`w-5 h-5 ${
// //                     favoriteMovies.find(movie => movie._id === id) 
// //                       ? "fill-primary text-primary" 
// //                       : ""
// //                   }`}
// //                 />
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         <p className='text-lg font-medium mt-20'>Your Favourite Cast</p>
// //         <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
// //           <div className='flex items-center gap-4 w-max px-4'>
// //             {show.movie.casts.slice(0, 12).map((cast, index)=>(
// //               <div className='flex flex-col items-center text-center' key={index}>
// //                 <img src={image_base_url + cast.profile_path} alt="" className='rounded-full h-20 md:h-20 aspect-square object-cover'/>
// //                 <p className='font-medium text-xs mt-3'>{cast.name}</p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //       <DateSelect dateTime={show.showTimes} id={id}/>

// //       <div className='px-6 md:px-16 lg:px-40'>
// //         <p className='text-lg font-medium mt-20 mb-8'>You May Also Like</p>
// //         <div className='flex flex-wrap max-sm:justify-center gap-8'>
// //           {shows.slice(0, 4).map((movie, index)=>(
// //             <MovieCard key={index} movie={movie}/>
// //           ))}
// //         </div>
// //         <div className='flex justify-center mt-20'>
// //           <button onClick={()=>{navigate('/movies'); scrollTo(0,)}} className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'>Show More</button>
// //         </div>
// //       </div>
// //     </div>
// //   ) : (
// //     <div>
// //       <Loading/>
// //     </div>
// //   )
// // }

// // export default MovieDetails

// import React, { useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import BlurCircle from '../components/BlurCircle';
// import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
// import TimeFormat from '../lib/TimeFormat';
// import DateSelect from '../components/DateSelect';
// import MovieCard from '../components/MovieCard';
// import Loading from '../components/Loading';
// import { useAppContext } from '../context/AppContext';
// import toast from 'react-hot-toast';

// const MovieDetails = () => {

//   const navigate = useNavigate();
//   const { id } = useParams(); // Using 'id' to match your route
  
//   const [show, setShow] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isFavorite, setIsFavorite] = useState(false);

//   const { shows, axios, getToken, user, fetchFavoriteMovies, favoriteMovies, toggleFavorite } = useAppContext();

//   // Check if movie is in favorites
//   useEffect(() => {
//     if (favoriteMovies && id) {
//       const isFav = favoriteMovies.some(fav => fav._id === id);
//       setIsFavorite(isFav);
//     }
//   }, [favoriteMovies, id]);

//   const getShow = async () => {
//     try {
//       setLoading(true);
//       console.log("Fetching show for movie ID:", id); // Debug log
      
//       const { data } = await axios.get(`/api/show/${id}`)
//       console.log("Show data received:", data); // Debug log
      
//       if (data.success) {
//         setShow(data);
//       } else {
//         toast.error(data.message || "Failed to load movie");
//       }
//     } catch (error) {
//       console.error("Error fetching show:", error);
//       toast.error("Failed to load movie details");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const handleFavorite = async () => {
//     try {
//       if (!user) return toast.error("Please login to proceed");

//       await toggleFavorite(id);
//       setIsFavorite(!isFavorite);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       getShow();
//     }
//   }, [id])

//   // Loading state
//   if (loading) {
//     return <Loading />;
//   }

//   // No show found
//   if (!show || !show.movie) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         <div className="text-center">
//           <p className="text-xl mb-4">Movie not found</p>
//           <button 
//             onClick={() => navigate('/movies')}
//             className="px-6 py-2 bg-primary rounded-full hover:bg-primary-dull transition"
//           >
//             Browse Movies
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='px-6 md:px-16 lg:px-40 md:pt-50'>
//         <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
//           <img 
//             src={show.movie.poster_path} 
//             alt={show.movie.title} 
//             className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover'
//             onError={(e) => {
//               console.log("Image failed to load:", show.movie.poster_path);
//               e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
//             }}
//           />
//           <div className='relative flex flex-col gap-3'>
//             <BlurCircle top='-100px' left='-100px'/>
//             <p className='text-primary uppercase'>{show.movie.original_language}</p>
//             <h1 className='text-4xl font-semibold max-w-96 text-balance'>{show.movie.title}</h1>
//             <div className='flex items-center gap-2 text-gray-300'>
//               <StarIcon className='w-5 h-5 text-primary fill-primary'/>
//               {show.movie.vote_average.toFixed(1)} User Rating
//             </div>
//             <p className='text-gray-400 mt-2 text-sm loading-tight max-w-xl'>{show.movie.overview}</p>
//             <p>
//               {TimeFormat(show.movie.runtime)} • {show.movie.genres.slice(0, 3).map(genre => genre.name).join(' | ')} • {show.movie.release_date.split('-')[0]}
//             </p>
//             <div className='flex items-center flex-wrap gap-4 mt-4'>
//               <button className='flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95'>
//                 <PlayCircleIcon className='w-5 h-5'/>
//                 Watch Trailer
//               </button>
//               <a href="#dateSelect" className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95'>Buy Tickets</a>
//               <button 
//                 onClick={handleFavorite} 
//                 className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95 hover:bg-gray-600'
//                 title={isFavorite ? "Remove from favorites" : "Add to favorites"}
//               >
//                 <Heart 
//                   className={`w-5 h-5 transition-colors ${
//                     isFavorite
//                       ? "fill-primary text-primary" 
//                       : "text-gray-400"
//                   }`}
//                 />
//               </button>
//             </div>
//           </div>
//         </div>

//         <p className='text-lg font-medium mt-20'>Your Favourite Cast</p>
//         <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
//           <div className='flex items-center gap-4 w-max px-4'>
//             {show.movie.casts.slice(0, 12).map((cast, index) => (
//               <div className='flex flex-col items-center text-center' key={index}>
//                 <img 
//                   src={cast.profile_path ? `https://image.tmdb.org/t/p/w200${cast.profile_path}` : 'https://via.placeholder.com/80?text=No+Image'} 
//                   alt={cast.name} 
//                   className='rounded-full h-20 md:h-20 aspect-square object-cover'
//                   onError={(e) => {
//                     e.target.src = 'https://via.placeholder.com/80?text=No+Image';
//                   }}
//                 />
//                 <p className='font-medium text-xs mt-3'>{cast.name}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
      
//       {/* Show Times Section */}
//       <DateSelect dateTime={show.showTimes} id={id}/>

//       <div className='px-6 md:px-16 lg:px-40'>
//         <p className='text-lg font-medium mt-20 mb-8'>You May Also Like</p>
//         <div className='flex flex-wrap max-sm:justify-center gap-8'>
//           {shows.slice(0, 4).map((movie, index) => (
//             <MovieCard key={index} movie={movie}/>
//           ))}
//         </div>
//         <div className='flex justify-center mt-20'>
//           <button 
//             onClick={() => { navigate('/movies'); scrollTo(0, 0) }} 
//             className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'
//           >
//             Show More
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default MovieDetails


import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BlurCircle from '../components/BlurCircle';
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import TimeFormat from '../lib/TimeFormat';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const { shows, axios, getToken, user, fetchFavoriteMovies, favoriteMovies, toggleFavorite } = useAppContext();

  // Check if movie is in favorites
  useEffect(() => {
    if (favoriteMovies && id) {
      const isFav = favoriteMovies.some(fav => fav._id === id);
      setIsFavorite(isFav);
    }
  }, [favoriteMovies, id]);

  const getShow = async () => {
    try {
      setLoading(true);
      console.log("Fetching show for movie ID:", id);
      
      const { data } = await axios.get(`/api/show/${id}`)
      console.log("Show data received:", data);
      
      if (data.success) {
        setShow(data);
      } else {
        toast.error(data.message || "Failed to load movie");
      }
    } catch (error) {
      console.error("Error fetching show:", error);
      toast.error("Failed to load movie details");
    } finally {
      setLoading(false);
    }
  }

  const handleFavorite = async () => {
    try {
      if (!user) return toast.error("Please login to proceed");

      await toggleFavorite(id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.log(error);
    }
  };

  // Navigate to seat layout - using your existing route format: /movies/:id/:date
  const handleShowSelect = (date, showId, time, price) => {
    if (!user) {
      toast.error("Please login to book tickets");
      return;
    }
    
    console.log("Navigating with:", { date, showId, time, price }); // Debug log
    
    // Navigate to /movies/:id/:date with state containing show details
    navigate(`/movies/${id}/${date}`, {
      state: {
        movieTitle: show.movie.title,
        moviePoster: show.movie.poster_path,
        showId: showId,
        showTime: time,
        showPrice: price,
        date: date,
        movieId: id
      }
    });
  };

  useEffect(() => {
    if (id) {
      getShow();
    }
  }, [id])

  // Loading state
  if (loading) {
    return <Loading />;
  }

  // No show found
  if (!show || !show.movie) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Movie not found</p>
          <button 
            onClick={() => navigate('/movies')}
            className="px-6 py-2 bg-primary rounded-full hover:bg-primary-dull transition"
          >
            Browse Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Movie Details Section */}
      <div className='px-6 md:px-16 lg:px-40 md:pt-50'>
        <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
          <img 
            src={show.movie.poster_path} 
            alt={show.movie.title} 
            className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover'
            onError={(e) => {
              console.log("Image failed to load:", show.movie.poster_path);
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
            }}
          />
          <div className='relative flex flex-col gap-3'>
            <BlurCircle top='-100px' left='-100px'/>
            <p className='text-primary uppercase'>{show.movie.original_language}</p>
            <h1 className='text-4xl font-semibold max-w-96 text-balance'>{show.movie.title}</h1>
            <div className='flex items-center gap-2 text-gray-300'>
              <StarIcon className='w-5 h-5 text-primary fill-primary'/>
              {show.movie.vote_average.toFixed(1)} User Rating
            </div>
            <p className='text-gray-400 mt-2 text-sm loading-tight max-w-xl'>{show.movie.overview}</p>
            <p>
              {TimeFormat(show.movie.runtime)} • {show.movie.genres.slice(0, 3).map(genre => genre.name).join(' | ')} • {show.movie.release_date.split('-')[0]}
            </p>
            <div className='flex items-center flex-wrap gap-4 mt-4'>
              <button className='flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95'>
                <PlayCircleIcon className='w-5 h-5'/>
                Watch Trailer
              </button>
              <a href="#showTimes" className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95'>
                Buy Tickets
              </a>
              <button 
                onClick={handleFavorite} 
                className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95 hover:bg-gray-600'
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${
                    isFavorite
                      ? "fill-primary text-primary" 
                      : "text-gray-400"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Cast Section */}
        <p className='text-lg font-medium mt-20'>Your Favourite Cast</p>
        <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
          <div className='flex items-center gap-4 w-max px-4'>
            {show.movie.casts.slice(0, 12).map((cast, index) => (
              <div className='flex flex-col items-center text-center' key={index}>
                <img 
                  src={cast.profile_path ? `https://image.tmdb.org/t/p/w200${cast.profile_path}` : 'https://via.placeholder.com/80?text=No+Image'} 
                  alt={cast.name} 
                  className='rounded-full h-20 md:h-20 aspect-square object-cover'
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                  }}
                />
                <p className='font-medium text-xs mt-3'>{cast.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Show Times Section */}
      <div id="showTimes" className='px-6 md:px-16 lg:px-40 mt-20 mb-16'>
        <h2 className='text-2xl font-semibold mb-8'>Available Show Times</h2>
        
        {show.showTimes && Object.keys(show.showTimes).length > 0 ? (
          <div className='space-y-6'>
            {Object.entries(show.showTimes).map(([date, times]) => (
              <div key={date} className='bg-gray-800/50 rounded-lg p-6'>
                <h3 className='text-lg font-semibold mb-4 text-primary'>
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <div className='flex flex-wrap gap-3'>
                  {times && times.length > 0 ? (
                    times.map((showItem) => (
                      <button
                        key={showItem.showId}
                        onClick={() => handleShowSelect(date, showItem.showId, showItem.time, showItem.showPrice)}
                        className='px-6 py-3 bg-gray-700 hover:bg-primary hover:text-white border-2 border-transparent hover:border-primary transition-all rounded-lg font-medium text-sm min-w-[100px]'
                      >
                        <div className='text-center'>
                          <h4 className='text-lg font-semibold mb-4 text-primary'>
                            {new Date(date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </h4>
                          <div className='text-lg font-bold'>{showItem.time}</div>
                          <div className='text-xs text-gray-400 mt-1'>${showItem.showPrice}</div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className='text-gray-400 py-2'>No shows available for this date</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='bg-gray-800/50 rounded-lg p-8 text-center'>
            <p className='text-gray-400 text-lg'>No shows available for this movie yet.</p>
            <p className='text-gray-500 text-sm mt-2'>Please check back later.</p>
          </div>
        )}
      </div>

      {/* Similar Movies Section */}
      <div className='px-6 md:px-16 lg:px-40 pb-20'>
        <p className='text-lg font-medium mt-20 mb-8'>You May Also Like</p>
        <div className='flex flex-wrap max-sm:justify-center gap-8'>
          {shows.slice(0, 4).map((movie, index) => (
            <MovieCard key={index} movie={movie}/>
          ))}
        </div>
        <div className='flex justify-center mt-20'>
          <button 
            onClick={() => { navigate('/movies'); scrollTo(0, 0) }} 
            className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'
          >
            Show More
          </button>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails