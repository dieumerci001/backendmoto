import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  bookRide, getMyBookings, getTodaySchedule,
  acceptBooking, declineBooking,
  setAvailability, setStatus, getMyRides, LOCATIONS
} from "../controllers/rideController.js";

const router = express.Router();

// Get Rwanda locations list
router.get("/locations", (req, res) => res.json(LOCATIONS));

// Passenger books — system auto-assigns
router.post("/book", protect, allowRoles("PASSENGER", "ADMIN"), bookRide);

// Passenger sees their rides
router.get("/my-rides", protect, allowRoles("PASSENGER", "ADMIN"), getMyRides);

// Motari sees today's schedule
router.get("/today", protect, allowRoles("MOTARI", "ADMIN"), getTodaySchedule);

// Motari sees incoming pending bookings
router.get("/bookings", protect, allowRoles("MOTARI", "ADMIN"), getMyBookings);

// Motari accepts a booking
router.put("/:id/accept", protect, allowRoles("MOTARI", "ADMIN"), acceptBooking);

// Motari declines — system reassigns
router.put("/:id/decline", protect, allowRoles("MOTARI", "ADMIN"), declineBooking);

// Motari sets full availability (days, hours, location)
router.post("/availability", protect, allowRoles("MOTARI", "ADMIN"), setAvailability);

// Motari quickly toggles Online/Offline/Busy
router.put("/status", protect, allowRoles("MOTARI", "ADMIN"), setStatus);

export default router;
