import express from "express";
import { getBalance, addMoney, withdrawMoney } from "../controllers/walletController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getBalance);
router.post("/add", protect, addMoney);
router.post("/withdraw", protect, withdrawMoney);

export default router;