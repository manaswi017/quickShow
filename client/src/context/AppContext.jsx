// import { createContext, useContext } from "react";
// // to make api calls that will set the states 
// import axios from 'axios';
// import { useAuth, useUser } from "@clerk/clerk-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;

// export const AppContext=createContext()

// export const AppProvider=({children})=>{

//     const [isAdmin, setIsAdmin]=useState(false);
//     const [shows, setShows]=useState([])
//     const [favoriteMovies, setFavoriteMovies]=useState([])

//     const {user}=useUser();
//     const {getToken}=useAuth();
//     const location=useLocation();
//     const navigate=useNavigate();

//     const fetchIsAdmin=async()=>{
//         try {
//             const {data}=await axios.get('/api/admin/is-admin', {headers: 
//                 {Authorization: `Bearer ${await getToken()}`}}
//             )
//             setIsAdmin(data.isAdmin);

//             // user not admin and the user is trying to open the admin path
//             // then just send user back to home
//             if (!data.isAdmin && location.pathname.startsWith('/admin')){
//                 navigate('/')
//                 toast.error("You are not authorized to access admin dashboard")
//             }
//         } catch (error){
//             console.log(error);
//         }
//     }

//     const fetchShows=async()=>{
//         try {
//             const {data}=await axios.get('/api/show/all')
//             if (data.success){
//                 setShows(data.shows)
//             }
//             else {
//                 toast.error(error);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     const fetchfavoriteMovies=async()=>{
//         try {
//             const {data}=await axios.get('/api/user/favorite', {headers: 
//                 {Authorization: `Bearer ${await getToken()}`}})

//                 if (data.success){
//                     setFavoriteMovies(data.movies);
//                 }
//                 else {
//                     toast.error(data.message);
//                 }
//         } catch(error) {
//             console.log(error);
//         }
//     }

//     useEffect(()=>{
//         fetchShows()
//     }, [])

//     // whenever a new user present run this part to check if he is admin also do this when the user changes
//     useEffect(()=>{
//         if (user) {
//             fetchIsAdmin()
//             fetchfavoriteMovies()
//         }
//     }, [user])

//     // pass values that will be accessible by all objevts 
//     const value={axios, fetchIsAdmin, user, getToken, navigate, isAdmin, shows, fetchShows, fetchfavoriteMovies, favoriteMovies}
//     return (
//         <AppContext.Provider value={value}>
//             { children }
//         </AppContext.Provider>
//     )
// }

// // to access this api in other files
// export const useAppContext=()=>useContext(AppContext);


import { createContext, useContext } from "react";
// to make api calls that will set the states 
import axios from 'axios';
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast'; // Add this import

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const [isAdmin, setIsAdmin] = useState(false);
    const [shows, setShows] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])

    const { user } = useUser();
    const { getToken } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const fetchIsAdmin = async () => {
        try {
            const { data } = await axios.get('/api/admin/is-admin', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            setIsAdmin(data.isAdmin);

            // user not admin and the user is trying to open the admin path
            // then just send user back to home
            if (!data.isAdmin && location.pathname.startsWith('/admin')) {
                navigate('/')
                toast.error("You are not authorized to access admin dashboard")
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchShows = async () => {
        try {
            const { data } = await axios.get('/api/show/all')
            if (data.success) {
                setShows(data.shows)
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchFavoriteMovies = async () => { // Fixed: Capital F
        try {
            const { data } = await axios.get('/api/user/favorites', { // Fixed: Changed to /favorites (plural)
                headers: { Authorization: `Bearer ${await getToken()}` }
            })

            if (data.success) {
                setFavoriteMovies(data.movies);
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const toggleFavorite = async (movieId) => { // Added: New function to toggle favorites
        try {
            const { data } = await axios.post('/api/user/update-favorite', 
                { movieId },
                { headers: { Authorization: `Bearer ${await getToken()}` }}
            )

            if (data.success) {
                // Refresh favorites after toggling
                await fetchFavoriteMovies();
                toast.success(data.message);
                return data;
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to update favorites");
            throw error;
        }
    }

    useEffect(() => {
        fetchShows()
    }, [])

    // whenever a new user present run this part to check if he is admin also do this when the user changes
    useEffect(() => {
        if (user) {
            fetchIsAdmin()
            fetchFavoriteMovies() // Fixed: Capital F
        }
    }, [user])

    // pass values that will be accessible by all objects 
    const value = { 
        axios, 
        fetchIsAdmin, 
        user, 
        getToken, 
        navigate, 
        isAdmin, 
        shows, 
        fetchShows, 
        fetchFavoriteMovies, // Fixed: Capital F
        favoriteMovies,
        toggleFavorite // Added: New function
    }
    
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

// to access this api in other files
export const useAppContext = () => useContext(AppContext);