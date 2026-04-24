import express from "express";
import { getMotariReport } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/report", protect, getMotariReport);

export default router;