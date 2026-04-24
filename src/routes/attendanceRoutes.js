import express from "express";
import { markAttendance, getAttendance } from "../controllers/attendanceController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, markAttendance);
router.get("/:meetingId", protect, getAttendance);

export default router;