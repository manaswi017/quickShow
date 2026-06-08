import React, { useEffect, useState } from 'react'
import Title from '../../components/admin/title'
import Loading from '../../components/Loading';
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react'
import { kConverter } from '../../lib/kConverter';
import { useAppContext } from '../../context/AppContext';

const AddShows = () => {

  const { axios, getToken } = useAppContext();

  const currency = import.meta.env.VITE_CURRENCY;

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");

  // Fetch now playing movies
  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await axios.get('/api/show/now-playing',
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        setNowPlayingMovies(data.movies);
      }
    } catch (error) {
      console.log("Error fetching movie", error);
    }
  };

  // Add selected date & time
  const handleDateTimeAdd = () => {
    if (!dateTimeInput || !dateTimeInput.includes("T")) {
      alert("Please select a valid date and time");
      return;
    }

    const [date, time] = dateTimeInput.split('T');

    console.log("ADDING DATE:", date, "TIME:", time);

    setDateTimeSelection(prev => {
      const existing = prev[date] || [];
      return { ...prev, [date]: [...new Set([...existing, time])] };
    });

    setDateTimeInput("");
  };

  // Remove a time
  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [date]: filteredTimes };
    });
  };

  // Add show handler
  const handleAddShow = async () => {
    if (!selectedMovie) {
      alert("Please select a movie");
      return;
    }
    
    // Check if at least one show time is added
    if (Object.keys(dateTimeSelection).length === 0) {
      alert("Please add at least one show time using the 'Add Time' button");
      return;
    }
    
    if (!showPrice) {
      alert("Please enter a show price");
      return;
    }

    const showInput = Object.entries(dateTimeSelection).map(([date, times]) => ({
      date,
      time: times
    }));

    console.log("Sending Show Input →", showInput);

    try {
      const { data } = await axios.post(
        "/api/show/add",
        {
          movieId: selectedMovie,
          showInput,
          showPrice,
        },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        alert("Show added successfully!");
        setDateTimeSelection({});
        setShowPrice("");
        setSelectedMovie(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error adding show");
    }
  };

  useEffect(() => {
    fetchNowPlayingMovies();
  }, []);

  // Check if form is complete
  const isFormValid = selectedMovie && Object.keys(dateTimeSelection).length > 0 && showPrice && showPrice.trim() !== "";

  // UI Rendering
  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1='Add' text2='Shows' />
      <p className='mt-10 text-lg font-medium'>Now Playing Movies</p>

      {/* Movie Selection */}
      <div className='overflow-x-auto pb-4'>
        <div className='group flex flex-wrap gap-4 mt-4 w-max'>
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie.id}
              className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300`}
              onClick={() => setSelectedMovie(movie.id)}
            >
              <div className='relative rounded-lg overflow-hidden'>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className='w-full object-cover brightness-90' />
                <div className='text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0'>
                  <p className='flex items-center gap-1 text-gray-400'>
                    <StarIcon className='w-4 h-4 text-primary fill-primary' />
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className='text-gray-300'>{kConverter(movie.vote_count)} Votes</p>
                </div>
              </div>

              {selectedMovie === movie.id && (
                <div className='absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded'>
                  <CheckIcon className='w-4 h-4 text-white' strokeWidth={2.5} />
                </div>
              )}

              <p className='font-medium truncate'>{movie.title}</p>
              <p className='text-gray-400 text-sm'>{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Show Price */}
      <div className='mt-8'>
        <label className='block text-sm font-medium mb-2'>Show Price</label>
        <div className='inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md'>
          <p className='text-gray-400 text-sm'>{currency}</p>
          <input 
            min={0} 
            type='number' 
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)} 
            placeholder='Enter show price'
            className='outline-none' 
          />
        </div>
      </div>

      {/* Date and Time Selector */}
      <div className='mt-6'>
        <label className='block text-sm font-medium mb-2'>Select Date and Time</label>
        <div className='inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg'>
          <input 
            type="datetime-local" 
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className='outline-none rounded-md' 
          />
          <button
            onClick={handleDateTimeAdd}
            disabled={!dateTimeInput}
            className={`px-3 py-2 text-sm rounded-lg transition-all ${
              dateTimeInput 
                ? 'bg-primary/80 text-white hover:bg-primary cursor-pointer' 
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            Add Time
          </button>
        </div>
      </div>

      {/* Selected Date-Time List */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className='mt-6'>
          <h2 className='mb-2 font-medium'>Selected Show Times</h2>
          <ul className='space-y-3'>
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date}>
                <div className='font-medium text-sm text-gray-300'>{date}</div>
                <div className='flex flex-wrap gap-2 mt-1 text-sm'>
                  {times.map((time) => (
                    <div key={time} className='border border-primary px-2 py-1 flex items-center rounded'>
                      <span>{time}</span>
                      <DeleteIcon 
                        onClick={() => handleRemoveTime(date, time)}
                        width={15} 
                        className='ml-2 text-red-500 hover:text-red-700 cursor-pointer' 
                      />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* FINAL FIXED BUTTON */}
      <button
        onClick={handleAddShow}
        disabled={!isFormValid}
        className={`px-8 py-2 mt-6 rounded transition-all ${
          isFormValid
            ? 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
        }`}
      >
        Add Show
      </button>

    </>
  ) : (
    <Loading />
  );
};

export default AddShows;