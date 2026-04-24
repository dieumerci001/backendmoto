import express from "express";
import {
  createMotorcycle,
  verifyMotorcycle,
  getAllMotorcycles
} from "../controllers/moto.js";

import { protect, isAdmin } from "../middleware/auth.js";

const MotoRoutes = express.Router();

/**
 * MOTORCYCLE ROUTES
 */

// Create motorcycle (authenticated user)
MotoRoutes.post("/", protect, createMotorcycle);

// Get all motorcycles
MotoRoutes.get("/", protect, getAllMotorcycles);

// Verify motorcycle (admin only)
MotoRoutes.put("/:id/verify", protect, isAdmin, verifyMotorcycle);

export default MotoRoutes;