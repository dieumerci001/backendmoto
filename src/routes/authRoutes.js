import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { register, login, verifyEmail, resendCode } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import bcrypt from "bcryptjs";
import User from "../database/models/User.js";

const router = express.Router();

// Standard Auth
router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendCode);

// Get current user profile (used after Google OAuth)
router.get("/me", passport.authenticate('jwt', { session: false }), (req, res) => {
  const { password, ...userData } = req.user.toJSON();
  res.json(userData);
});

// --- Profile Routes (protected) ---

// GET profile
router.get("/profile", protect, (req, res) => {
  const { password, ...userData } = req.user.toJSON();
  res.json(userData);
});

// PUT update name & phone
router.put("/profile", protect, async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    await req.user.update({ fullName, phone });
    const { password, ...userData } = req.user.toJSON();
    res.json({ message: "Profile updated", user: userData });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT change password — requires current password for normal users, free set for Google users
router.put("/profile/password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ message: "New password is required" });
    if (newPassword.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters" });

    // Google user setting password for first time
    if (req.user.googleId && !req.user.password) {
      req.user.password = bcrypt.hashSync(newPassword, 10);
      await req.user.save();
      return res.json({ message: "Password set successfully! You can now use it to login and delete your account." });
    }

    // Google user who already has a password OR normal user — require current password
    if (!currentPassword) return res.status(400).json({ message: "Current password is required" });
    const match = await bcrypt.compare(currentPassword, req.user.password);
    if (!match) return res.status(400).json({ message: "Current password is incorrect" });
    req.user.password = bcrypt.hashSync(newPassword, 10);
    req.user.mustChangePassword = false;
    await req.user.save();
    res.json({ message: "Password changed successfully" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE account — password required for normal users, just type DELETE for Google users with no password
router.delete("/profile", protect, async (req, res) => {
  try {
    const { password } = req.body;
    if (req.user.role === "ADMIN") return res.status(403).json({ message: "Admin account cannot be deleted" });
    // Google user who never set a password
    if (req.user.googleId && !req.user.password) {
      await req.user.destroy();
      return res.json({ message: "Account permanently deleted" });
    }
    // Everyone else (normal user OR Google user who set a password)
    if (!password) return res.status(400).json({ message: "Password is required" });
    const match = await bcrypt.compare(password, req.user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });
    await req.user.destroy();
    res.json({ message: "Account permanently deleted" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// --- Google OAuth Routes ---

// 1. Redirect to Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 2. Google Callback
router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;

    // New Google user who hasn't verified yet
    if (!user.isVerified) {
      return res.redirect(`http://localhost:5173/verify-email?userId=${user.id}&email=${encodeURIComponent(user.email)}&google=true`);
    }

    // Already verified — issue JWT and redirect to dashboard
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);

export default router;