import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  getAllUsers, updateUser, deleteUser,
  getAllRides, deleteRide,
  getAllGroups, deleteGroup,
  getAllPayments, getStats,
  getAllLeaders, addLeader, deleteLeader,
} from "../controllers/adminController.js";

const router = express.Router();
router.use(protect, allowRoles("ADMIN"));

router.get("/stats", getStats);

router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/rides", getAllRides);
router.delete("/rides/:id", deleteRide);

router.get("/groups", getAllGroups);
router.delete("/groups/:id", deleteGroup);

router.get("/payments", getAllPayments);

router.get("/leaders", getAllLeaders);
router.post("/leaders", addLeader);
router.delete("/leaders/:id", deleteLeader);

export default router;
