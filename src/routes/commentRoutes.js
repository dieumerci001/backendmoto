import express from "express";
import { addComment, getComments } from "../controllers/commentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// add comment
router.post("/", protect, addComment);

// get comments for motari
router.get("/:motariId", protect, getComments);

export default router;