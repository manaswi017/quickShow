import Booking from "../models/Booking.js";
import Shows from "../models/Shows.js";
import User from "../models/User.js";

// api to check user is admin
export const isAdmin = async (req, res) => {
    res.json({ success: true, isAdmin: true });
    // how this works is in auth middleware we are checking if user is admin or not and then we adding the middleware before this route so if the user is admin then only this function will execute
    // so this function returns the response which tells the frontend whether to render the admin dashboard or no
}

// api to get dashboard stats
export const getDashboardStats = async (req, res) => {
    try {
        // Fixed: Use proper MongoDB query object syntax
        const bookings = await Booking.find({ isPaid: true });
        
        // Fixed: Proper populate syntax
        const activeShows = await Shows.find({ showDateTime: { $gte: new Date() } })
            .populate('movie')
            .sort({ showDateTime: 1 })
            .limit(10);

        console.log("Active Shows Found:", activeShows.length);
        console.log("First Show:", activeShows[0]);

        // find total num of users
        const totalUsers = await User.countDocuments();

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUsers
        }
        
        res.json({ success: true, dashboardData });
    } catch (error) {
        console.error("Error in getDashboardStats:", error.message);
        res.json({ success: false, message: error.message });
    }
};

// api to get all shows
export const getAllShows = async (req, res) => {
    try {
        const shows = await Shows.find({ showDateTime: { $gte: new Date() } }).populate('movie').sort({ showDateTime: 1 });
        res.json({ success: true, shows });
    } catch (error) {
        console.error("Error", error.message);
        res.json({ success: false, message: error.message });
    }
}

// api to get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user')
            .populate({ path: 'show', populate: { path: 'movie' } })
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.error("Error in getAllBookings:", error.message);
        res.json({ success: false, message: error.message });
    }
}