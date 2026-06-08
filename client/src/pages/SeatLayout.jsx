// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAppContext } from '../context/AppContext';
// import toast from 'react-hot-toast';

// const SeatLayout = () => {
//   const { showId } = useParams();
//   const navigate = useNavigate();
//   const { axios, getToken, user } = useAppContext();

//   const [occupiedSeats, setOccupiedSeats] = useState([]);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [showData, setShowData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Seat rows and columns
//   const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
//   const seatsPerRow = 9;

//   // Fetch show details and occupied seats
//   useEffect(() => {
//     const fetchShowDetails = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch occupied seats
//         const seatsResponse = await axios.get(`/api/booking/seats/${showId}`);
        
//         if (seatsResponse.data.success) {
//           setOccupiedSeats(seatsResponse.data.occupiedSeats);
//         }

//         // Fetch show details (we need to add this API endpoint)
//         // For now, we'll just use the showId
//         console.log("Show ID:", showId);
        
//       } catch (error) {
//         console.error("Error fetching show details:", error);
//         toast.error("Failed to load seat information");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (showId) {
//       fetchShowDetails();
//     }
//   }, [showId, axios]);

//   // Toggle seat selection
//   const toggleSeat = (seat) => {
//     if (occupiedSeats.includes(seat)) {
//       toast.error("This seat is already booked");
//       return;
//     }

//     if (selectedSeats.includes(seat)) {
//       setSelectedSeats(selectedSeats.filter(s => s !== seat));
//     } else {
//       setSelectedSeats([...selectedSeats, seat]);
//     }
//   };

//   // Handle booking
//   const handleBooking = async () => {
//     if (!user) {
//       toast.error("Please login to book tickets");
//       return;
//     }

//     if (selectedSeats.length === 0) {
//       toast.error("Please select at least one seat");
//       return;
//     }

//     try {
//       const { data } = await axios.post(
//         '/api/booking/create',
//         {
//           showId,
//           selectedSeats
//         },
//         {
//           headers: { Authorization: `Bearer ${await getToken()}` }
//         }
//       );

//       if (data.success) {
//         // Redirect to payment
//         window.location.href = data.url;
//       } else {
//         toast.error(data.message || "Failed to create booking");
//       }
//     } catch (error) {
//       console.error("Error creating booking:", error);
//       toast.error("Failed to create booking");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
//           <p className="text-xl">Loading seats...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white py-10">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
//           {/* Left Sidebar - Available Timings */}
//           <div className="lg:col-span-1">
//             <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 sticky top-4">
//               <h2 className="text-xl font-bold mb-4">Available Timings</h2>
              
//               {/* Show the selected show time */}
//               <div className="space-y-3">
//                 <div className="bg-gray-800 p-4 rounded-lg border-2 border-primary">
//                   <p className="text-sm text-gray-400 mb-1">Show ID</p>
//                   <p className="font-mono text-xs text-gray-300 break-all">{showId}</p>
//                 </div>
                
//                 <div className="text-sm text-gray-400 space-y-2">
//                   <p>✓ Selected show</p>
//                   <p className="text-xs">Select your seats on the right to continue</p>
//                 </div>
//               </div>

//               {/* Selected Seats Info */}
//               {selectedSeats.length > 0 && (
//                 <div className="mt-6 p-4 bg-primary/20 border border-primary rounded-lg">
//                   <p className="text-sm text-gray-300 mb-2">Selected Seats:</p>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedSeats.map(seat => (
//                       <span key={seat} className="px-2 py-1 bg-primary rounded text-xs font-semibold">
//                         {seat}
//                       </span>
//                     ))}
//                   </div>
//                   <p className="text-sm text-gray-300 mt-3">
//                     Total: <span className="font-bold">{selectedSeats.length}</span> seat(s)
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right Side - Seat Selection */}
//           <div className="lg:col-span-3">
//             <h1 className="text-3xl font-bold mb-8 text-center">Select Your Seats</h1>

//             {/* Screen */}
//             <div className="mb-12">
//               <div className="w-full max-w-4xl mx-auto">
//                 <div className="h-2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mb-4"></div>
//                 <p className="text-center text-gray-400 text-sm">SCREEN SIDE</p>
//               </div>
//             </div>

//             {/* Seat Grid */}
//             <div className="mb-8 max-w-4xl mx-auto">
//               {rows.map((row) => (
//                 <div key={row} className="flex justify-center items-center gap-2 mb-2">
//                   <span className="w-8 text-center font-semibold text-gray-400">{row}</span>
                  
//                   {Array.from({ length: seatsPerRow }, (_, i) => {
//                     const seatNumber = i + 1;
//                     const seatId = `${row}${seatNumber}`;
//                     const isOccupied = occupiedSeats.includes(seatId);
//                     const isSelected = selectedSeats.includes(seatId);

//                     return (
//                       <button
//                         key={seatId}
//                         onClick={() => toggleSeat(seatId)}
//                         disabled={isOccupied}
//                         className={`
//                           w-10 h-10 rounded-t-lg border-2 transition-all text-xs font-semibold
//                           ${isOccupied ? 'bg-gray-700 border-gray-600 cursor-not-allowed opacity-50' : ''}
//                           ${isSelected ? 'bg-primary border-primary scale-105' : ''}
//                           ${!isOccupied && !isSelected ? 'bg-gray-800 border-gray-600 hover:border-primary hover:scale-105' : ''}
//                         `}
//                       >
//                         {seatNumber}
//                       </button>
//                     );
//                   })}
                  
//                   <span className="w-8 text-center font-semibold text-gray-400">{row}</span>
//                 </div>
//               ))}
//             </div>

//             {/* Legend */}
//             <div className="flex justify-center gap-8 mb-8">
//               <div className="flex items-center gap-2">
//                 <div className="w-6 h-6 bg-gray-800 border-2 border-gray-600 rounded-t-lg"></div>
//                 <span className="text-sm">Available</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-6 h-6 bg-primary border-2 border-primary rounded-t-lg"></div>
//                 <span className="text-sm">Selected</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-6 h-6 bg-gray-700 border-2 border-gray-600 rounded-t-lg"></div>
//                 <span className="text-sm">Occupied</span>
//               </div>
//             </div>

//             {/* Booking Button */}
//             <div className="max-w-4xl mx-auto">
//               <button
//                 onClick={handleBooking}
//                 disabled={selectedSeats.length === 0}
//                 className={`w-full py-4 rounded-lg font-semibold text-lg transition ${
//                   selectedSeats.length > 0
//                     ? 'bg-primary hover:bg-primary-dull text-white'
//                     : 'bg-gray-700 text-gray-400 cursor-not-allowed'
//                 }`}
//               >
//                 {selectedSeats.length > 0 
//                   ? `Proceed to Payment (${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''})` 
//                   : 'Select seats to continue'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SeatLayout;

import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const SeatLayout = () => {
  const { id, date } = useParams(); // id = movieId, date = selected date
  const location = useLocation();
  const navigate = useNavigate();
  const { axios, getToken, user } = useAppContext();
  
  // Get data from navigation state
  const { movieTitle, moviePoster, showId, showTime, showPrice } = location.state || {};
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if no state data
  useEffect(() => {
    if (!showId || !movieTitle) {
      toast.error('Please select a show time');
      navigate(`/movies/${id}`);
    }
  }, [showId, movieTitle, id, navigate]);

  // Fetch occupied seats
  useEffect(() => {
    const fetchOccupiedSeats = async () => {
      if (!showId) return;
      
      try {
        const { data } = await axios.get(`/api/booking/seats/${showId}`);
        
        if (data.success) {
          setOccupiedSeats(data.occupiedSeats || []);
        } else {
          toast.error('Failed to load seat data');
        }
      } catch (error) {
        console.error('Error fetching occupied seats:', error);
        toast.error('Failed to load seat data');
      } finally {
        setLoading(false);
      }
    };

    fetchOccupiedSeats();
  }, [showId, axios]);

  // Handle seat selection
  const handleSeatClick = (seatId) => {
    if (occupiedSeats.includes(seatId)) {
      toast.error('This seat is already booked');
      return;
    }

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(seat => seat !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  // Generate seat layout
  const generateSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 12;

    return rows.map(row => (
      <div key={row} className="flex gap-2 mb-2 justify-center">
        <span className="w-8 text-center font-bold text-gray-400">{row}</span>
        {[...Array(seatsPerRow)].map((_, index) => {
          const seatNumber = index + 1;
          const seatId = `${row}${seatNumber}`;
          const isOccupied = occupiedSeats.includes(seatId);
          const isSelected = selectedSeats.includes(seatId);

          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              disabled={isOccupied}
              className={`w-8 h-8 rounded-t-lg border-2 transition-all text-xs font-semibold ${
                isOccupied
                  ? 'bg-gray-600 cursor-not-allowed border-gray-700 text-gray-400'
                  : isSelected
                  ? 'bg-primary border-primary text-white scale-110'
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {seatNumber}
            </button>
          );
        })}
      </div>
    ));
  };

  // Handle booking
  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    if (!user) {
      toast.error('Please login to continue');
      return;
    }

    try {
      const token = await getToken();
      const { data } = await axios.post(
        '/api/booking/create',
        {
          showId,
          selectedSeats,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success('Redirecting to payment...');
        // Redirect to payment
        window.location.href = data.url;
      } else {
        toast.error(data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-white">Loading seats...</div>
      </div>
    );
  }

  if (!showId || !movieTitle) {
    return null; // Will redirect via useEffect
  }

  const totalPrice = selectedSeats.length * (showPrice || 0);

  return (
    <div className="min-h-screen bg-black-900 text-white pb-32 my-20">
      <div className="container mx-auto px-4 py-8">
        {/* Movie Info Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{movieTitle}</h1>
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <span>{new Date(date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}</span>
            <span>•</span>
            <span>{showTime}</span>
            <span>•</span>
            <span>${showPrice} per seat</span>
          </div>
        </div>

        {/* Screen */}
        <div className="mb-12">
          <div className="w-full max-w-3xl mx-auto">
            <div className="h-1 bg-gradient-to-b from-gray-400 to-transparent rounded-t-full mb-4"></div>
            <p className="text-center text-gray-500 text-sm uppercase tracking-widest">Screen</p>
          </div>
        </div>

        {/* Seat Layout */}
        <div className="mb-12">
          <div className="max-w-4xl mx-auto">
            {generateSeats()}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-8 mb-8 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-800 border-2 border-gray-700 rounded"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary border-2 border-primary rounded"></div>
            <span className="text-sm">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-600 border-2 border-gray-700 rounded"></div>
            <span className="text-sm">Occupied</span>
          </div>
        </div>

        {/* Booking Summary - Fixed Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t-2 border-gray-700 p-4 shadow-lg z-50">
          <div className="container mx-auto flex justify-between items-center max-w-6xl">
            <div>
              <p className="text-sm text-gray-400">
                Selected Seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
              </p>
              <p className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</p>
            </div>
            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dull disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-lg"
            >
              Pay ${totalPrice.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;