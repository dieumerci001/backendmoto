import jwt from "jsonwebtoken";
import User from "../database/models/User.js";

// 🔐 PROTECT MIDDLEWARE
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("HEADER:", authHeader); // 👈 ADD THIS

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token); // 👈 ADD THIS

    console.log("SECRET_KEY:", process.env.SECRET_KEY);
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    console.log("DECODED:", decoded); // 👈 ADD THIS

    req.user = decoded;

    next();
  } catch (error) {
    console.log("ERROR:", error.message); // 👈 ADD THIS
    return res.status(401).json({ message: "Invalid token" });
  }
};

// 👮 ADMIN CHECK (optional but useful later)
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};