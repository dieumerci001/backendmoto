import express from "express";
import { register, login } from "../controllers/users.js";

const router = express.Router();

/**
 * AUTH ROUTES
 */

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);

export default router;