import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../database/models/User.js";
import { Op } from "sequelize";
import { sendVerificationEmail } from "../services/emailService.js";

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export const register = async (req, res) => {
  try {
    const { fullName, email, phone, password, role } = req.body;

    // Motari accounts are created by leaders only — not self-registration
    if (role && role.toUpperCase() === 'MOTARI') {
      return res.status(403).json({ message: "Motari accounts are created by group leaders only. Please contact your cooperative leader." });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: email || "never_match" },
          { phone: phone || "never_match" },
        ],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email or Phone already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = generateCode();

    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: "PASSENGER",
      verificationCode: code,
      isVerified: false,
    });

    await sendVerificationEmail(email, fullName, code);

    res.status(201).json({ message: "Registration successful! Check your email for the verification code.", userId: user.id });
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { userId, code } = req.body;

    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Account already verified" });
    if (user.verificationCode !== code) return res.status(400).json({ message: "Invalid verification code" });

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendCode = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Account already verified" });

    const code = generateCode();
    user.verificationCode = code;
    await user.save();

    await sendVerificationEmail(user.email, user.fullName, code);

    res.json({ message: "New verification code sent to your email." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, phone, password } = req.body;
    const loginValue = identifier || phone;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ phone: loginValue }, { email: loginValue }],
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in.", userId: user.id, needsVerification: true });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "7d" });

    const { password: _, ...userData } = user.toJSON();

    // If motari must change password on first login
    if (user.mustChangePassword) {
      return res.json({ message: "Login successful", token, user: userData, mustChangePassword: true });
    }

    res.json({ message: "Login successful", token, user: userData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
