import jwt from "jsonwebtoken";
import User from "../database/models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // 🔥 THIS FIXES YOUR SYSTEM

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};