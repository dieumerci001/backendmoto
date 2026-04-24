import express from "express";
import http from "http";
import { Server } from "socket.io";
import sequelize from "./src/config/db.js";

// routes
import userRoutes from "./src/routes/userRoutes.js";
import motoRoutes from "./src/routes/motoRoutes.js";
import rideRoutes from "./src/routes/rideRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import maintenanceRoutes from "./src/routes/maintenanceRoutes.js";
import groupRoutes from "./src/routes/groupRoutes.js";
import walletRoutes from "./src/routes/walletRoutes.js";
import "./src/config/passport.js"; // This initializes the 'google' strategy
import passport from "passport";

import aiRoutes from "./src/routes/aiRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

import meetingRoutes from "./src/routes/meetingRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import attendanceRoutes from "./src/routes/attendanceRoutes.js";

import leaderRoutes from "./src/routes/leaderRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";


const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" }
// });
 

import cors from "cors"; // 1. Import CORS

app.use(cors({
  origin: "http://localhost:5173", // Allow your frontend
  credentials: true,               // Allow cookies/headers
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" } // Best practice: match frontend URL
});


app.use(express.json());

// make io accessible in controllers
app.set("io", io);


app.use("/api/payments", paymentRoutes);

app.use(passport.initialize());
// routes
app.use("/api/motos", motoRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/attendance", attendanceRoutes);

app.use("/api/leader", leaderRoutes);
app.use("/api/admin", adminRoutes);



io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // motari joins zone
  socket.on("joinZone", (zone) => {
    socket.join(zone);
    console.log(`Motari joined zone: ${zone}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

sequelize.sync({ alter: false }).then(() => {
  server.listen(5000, () => {
    console.log("✅ Server running on port 5000");
    console.log("✅ Database connected:", process.env.DB_HOST);
  });
}).catch(err => {
  console.error("❌ Database connection failed:", err.message);
});