import express from "express";
import { createMeeting, getMeetings } from "../controllers/meetingController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// leader creates meeting
router.post("/", protect, createMeeting);

// everyone can view meetings
router.get("/", protect, getMeetings);

export default router;