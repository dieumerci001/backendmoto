import express from "express";
import {
  createPayment,
  getPayments
} from "../controllers/payment.js";

import { protect } from "../middleware/auth.js";

const PayRoutes = express.Router();

/**
 * PAYMENT ROUTES
 */

// Create payment
PayRoutes.post("/", protect, createPayment);

// Get all payments
PayRoutes.get("/", protect, getPayments);

export default PayRoutes;