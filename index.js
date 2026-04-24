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
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// FRONTEND_URL should be set in Render (or fallback to local dev URL)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const SERVE_FRONTEND = process.env.SERVE_FRONTEND === 'true';

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    // If backend is serving frontend, accept requests from anywhere (frontend will be same origin)
    if (SERVE_FRONTEND) return callback(null, true);
    const allowed = [FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"];
    if (allowed.indexOf(origin) !== -1) return callback(null, true);
    if (origin === process.env.BACKEND_HOST) return callback(null, true);
    return callback(new Error("CORS policy: This origin is not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: SERVE_FRONTEND ? true : [FRONTEND_URL, "http://localhost:5173"] }
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

// Serve frontend static files if built inside motari-frontend/dist or copied to public/
// This middleware is placed after API routes so /api/* continues to work.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist1 = path.join(__dirname, "motari-frontend", "dist");
const frontendDist2 = path.join(__dirname, "public");
let frontendDist = null;
if (fs.existsSync(frontendDist1)) frontendDist = frontendDist1;
else if (fs.existsSync(frontendDist2)) frontendDist = frontendDist2;

if (frontendDist) {
  console.log("Serving frontend from:", frontendDist);
  app.use(express.static(frontendDist));
  // SPA fallback
  app.get('*', (req, res) => {
    // keep API routes intact
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else if (SERVE_FRONTEND) {
  console.warn('SERVE_FRONTEND is true but no built frontend found at motari-frontend/dist or public/');
}

const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: false }).then(() => {
  server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log("✅ Database connected:", process.env.DATABASE_URL || process.env.DB_HOST);
  });
}).catch(err => {
  console.error("❌ Database connection failed:", err.message || err);
});