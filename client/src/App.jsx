import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Movies from './pages/Movies'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favourite from './pages/Favourite'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/admin/Dashboard'
import Layout from './pages/admin/Layout'
import ListBookings from './pages/admin/ListBookings'
import ListShows from './pages/admin/ListShows'
import AddShows from './pages/admin/AddShows'
import { SignIn } from '@clerk/clerk-react'
import { useUser } from '@clerk/clerk-react'
import Loading from './components/Loading'

const App = () => {

  const {user}=useUser();

  // if user is admin hide this navbar
  const isAdminRoute=useLocation().pathname.startsWith('/admin')

  return (
    <>
      <Toaster/>  {/* since we have mounted it here in app.jsx we can use it in any file */} 
      {!isAdminRoute && <Navbar/>}
      <Routes>
        <Route  path='/' element={<Home/>}/>
        <Route  path='/movies' element={<Movies/>}/>
        <Route  path='/movies/:id' element={<MovieDetails/>}/>
        <Route  path='/movies/:id/:date' element={<SeatLayout/>}/>
        <Route  path='/my-bookings' element={<MyBookings/>}/>
        {/* this is for payment loading screen */}
        <Route  path='/loading/:nextUrl' element={<Loading/>}/> 
        <Route  path='/favourite' element={<Favourite/>}/>

        {/* the prefix /adim/ will come before all admin routes  */}
        <Route path='/admin/*' element={user? <Layout/>:(
          <div className='min-h-screen flex justify-center items-center'>
            <SignIn fallbackRedirectUrl={'/admin'}/>
          </div>
        )
        }>
          <Route index element={<Dashboard/>}></Route>
          <Route path='add-shows' element={<AddShows/>}></Route>
          <Route path='list-shows' element={<ListShows/>}></Route>
          <Route path='list-bookings' element={<ListBookings/>}></Route>
        </Route>
      </Routes>
      {!isAdminRoute && <Footer/>}
    </>
  )
}

export default App
