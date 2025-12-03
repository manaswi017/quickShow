import express from "express";
import { createBookings, getOccupiedSeats } from "../controllers/bookingController.js";
import { get } from "mongoose";

const bookingRouter = express.Router();

bookingRouter.post("/create", createBookings);
bookingRouter.get("/seats/:showId", getOccupiedSeats);

export default bookingRouter;