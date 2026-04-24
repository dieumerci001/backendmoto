import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  getDashboard, getMyMotaris, addMotari,
  uploadMotaris, removeMotari, getMyGroup, createGroup
} from "../controllers/leaderController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect, allowRoles("LEADER", "ADMIN"));

router.get("/dashboard", getDashboard);
router.get("/group", getMyGroup);
router.post("/group", createGroup);
router.get("/motaris", getMyMotaris);
router.post("/motaris", addMotari);
router.post("/motaris/upload", upload.single("file"), uploadMotaris);
router.delete("/motaris/:motariId", removeMotari);

export default router;
