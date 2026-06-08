// import { useState } from 'react'
// import BlurCircle from './BlurCircle'
// import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';

// const DateSelect = ({dateTime, id}) => {
//   const navigate=useNavigate();
//   // at 1st no selected date
//   const [selected, setSelected]=useState(null);
//   const onBookHandler=()=>{
//     if(!selected) return toast.error('Please select a date');
//     // redirect to seat layout page with movie id and selected date
//     navigate(`/movies/${id}/${selected}`);
//     scrollTo(0,0); 
//   }
//   return (
//     <div id='dateSelect' className='pt-28 px:6 md:px-16 lg:px-40 pb-20'>
//       <div className='flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg'>
//         <BlurCircle top='-100px' left='-100px'/>
//         <BlurCircle top='100px' right='0px'/>
//         <div>
//             <p className='text-lg font-semibold'>Choose Date</p>
//             <div className='flex items-center gap-6 text-sm mt-5'>
//                 <ChevronLeftIcon width={28}/>
//                 <span className='grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4'>
//                   {Object.keys(dateTime).map((date) => (
//                     <button onClick={()=>setSelected(date)} key={date} className={`flex flex-col items-center h-14 w-14 aspect-square rounded cursor-pointer ${selected===date ? 'bg-primary text-white' : 'border border-primary/70'}`}>
//                       <span>{new Date(date).getDate()}</span>
//                       <span>{new Date(date).toLocaleDateString('en-US', {month:'short'})}</span>
//                     </button>
//                   ))}
//                 </span>
//                 <ChevronRightIcon width={28}/>
//             </div>
//         </div>
//         <button onClick={onBookHandler} className='bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer'>Book Now</button>
//       </div>
//     </div>
//   )
// }

// export default DateSelect


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DateSelect = ({ dateTime, id }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Get sorted dates
  const dates = Object.keys(dateTime || {}).sort();

  // Set first date as default if not selected
  React.useEffect(() => {
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0]);
    }
  }, [dates]);

  const handleBookNow = () => {
    if (!selectedTime) {
      alert('Please select a time slot');
      return;
    }
    navigate(`/movies/${id}/${selectedDate}`);
  };

  if (!dateTime || dates.length === 0) {
    return (
      <div id="dateSelect" className="px-6 md:px-16 lg:px-40 py-10">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-8 text-center">
          <p className="text-xl text-red-400">No shows available for this movie</p>
        </div>
      </div>
    );
  }

  return (
    <div id="dateSelect" className="px-6 md:px-16 lg:px-40 py-10">
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Choose Date</h2>

        {/* Date Selection */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => {
              const currentIndex = dates.indexOf(selectedDate);
              if (currentIndex > 0) {
                setSelectedDate(dates[currentIndex - 1]);
                setSelectedTime(null);
              }
            }}
            disabled={dates.indexOf(selectedDate) === 0}
            className="p-2 hover:bg-gray-800 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex gap-4 overflow-x-auto no-scrollbar flex-1">
            {dates.map((date) => {
              const dateObj = new Date(date);
              const day = dateObj.getDate();
              const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
              
              return (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }}
                  className={`flex flex-col items-center justify-center min-w-[80px] py-3 px-4 rounded-lg border-2 transition ${
                    selectedDate === date
                      ? 'border-primary bg-primary/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <span className="text-2xl font-bold">{day}</span>
                  <span className="text-sm text-gray-400">{month}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              const currentIndex = dates.indexOf(selectedDate);
              if (currentIndex < dates.length - 1) {
                setSelectedDate(dates[currentIndex + 1]);
                setSelectedTime(null);
              }
            }}
            disabled={dates.indexOf(selectedDate) === dates.length - 1}
            className="p-2 hover:bg-gray-800 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Available Timings </h3>
            <div className="flex flex-wrap gap-3">
              {dateTime[selectedDate] && dateTime[selectedDate].length > 0 ? (
                dateTime[selectedDate].map((timeSlot, index) => {
                  console.log("Time slot:", timeSlot); // Debug log
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedTime(timeSlot.showId)}
                      className={`px-6 py-3 rounded-lg border-2 transition font-medium ${
                        selectedTime === timeSlot.showId
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-700 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {timeSlot.time}
                    </button>
                  );
                })
              ) : (
                <p className="text-gray-400">No shows available for this date</p>
              )}
            </div>
          </div>
        )}

        {/* Book Now Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleBookNow}
            disabled={!selectedTime}
            className={`px-8 py-3 rounded-lg font-medium transition ${
              selectedTime
                ? 'bg-primary hover:bg-primary-dull text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateSelect;
