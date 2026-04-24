import User from "../database/models/User.js";
import Ride from "../database/models/Ride.js";
import Group from "../database/models/Group.js";
import payment from "../database/models/payment.js";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../services/emailService.js";

// ── Users ──────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const updateUser = async (req, res) => {
  try {
    await User.update(req.body, { where: { id: req.params.id } });
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ["password"] } });
    res.json(user);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: "User deleted" });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── Rides ──────────────────────────────────────────────
export const getAllRides = async (req, res) => {
  try {
    const rides = await Ride.findAll();
    res.json(rides);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const deleteRide = async (req, res) => {
  try {
    await Ride.destroy({ where: { id: req.params.id } });
    res.json({ message: "Ride deleted" });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── Groups ─────────────────────────────────────────────
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.findAll();
    res.json(groups);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const deleteGroup = async (req, res) => {
  try {
    await Group.destroy({ where: { id: req.params.id } });
    res.json({ message: "Group deleted" });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── Payments ───────────────────────────────────────────
export const getAllPayments = async (req, res) => {
  try {
    const payments = await payment.findAll();
    res.json(payments);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── Stats ──────────────────────────────────────────────
export const getStats = async (req, res) => {
  try {
    const [totalUsers, totalRides, totalGroups, totalPayments] = await Promise.all([
      User.count(),
      Ride.count(),
      Group.count(),
      payment.count(),
    ]);
    res.json({ totalUsers, totalRides, totalGroups, totalPayments });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── Leaders ────────────────────────────────────────────
export const getAllLeaders = async (req, res) => {
  try {
    const leaders = await User.findAll({
      where: { role: "LEADER" },
      attributes: { exclude: ["password"] },
      include: [{ model: Group, as: "ledGroup", attributes: ["id", "name"] }]
    });
    res.json(leaders);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const addLeader = async (req, res) => {
  try {
    const { fullName, email, phone, cooperativeName } = req.body;
    if (!fullName || !phone) return res.status(400).json({ message: "Full name and phone are required" });

    // Check duplicate
    const existing = await User.findOne({ where: { phone } });
    if (existing) return res.status(400).json({ message: "A user with this phone already exists" });

    const tempPassword = "Leader@1234";
    const hashed = bcrypt.hashSync(tempPassword, 10);

    const leader = await User.create({
      fullName, email: email || null, phone,
      password: hashed,
      role: "LEADER",
      isVerified: true
    });

    // Create their cooperative group automatically
    if (cooperativeName) {
      await Group.create({ name: cooperativeName, leaderId: leader.id });
    }

    // Send welcome email if email provided
    if (email) {
      try {
        await sendVerificationEmail(email, fullName,
          `Welcome to MMS Rwanda as a Group Leader!\n\nYour login credentials:\nEmail: ${email}\nPhone: ${phone}\nTemporary Password: ${tempPassword}\n\nPlease change your password after first login.`
        );
      } catch {}
    }

    const { password: _, ...leaderData } = leader.toJSON();
    res.status(201).json({ message: `Leader ${fullName} added successfully!`, leader: leaderData, tempPassword });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const deleteLeader = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id, role: "LEADER" } });
    res.json({ message: "Leader removed" });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
