import express from "express";
import { addMaintenance, getMaintenance } from "../controllers/maintenanceController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, addMaintenance);
router.get("/:motoId", protect, getMaintenance);

export default router;