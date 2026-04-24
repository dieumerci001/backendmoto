import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { createGroup, addMember, suspendMember } from "../controllers/groupController.js";

const router = express.Router();

// leader only
router.post("/", protect, allowRoles("LEADER"), createGroup);
router.post("/add", protect, allowRoles("LEADER"), addMember);
router.post("/suspend", protect, allowRoles("LEADER"), suspendMember);

export default router;