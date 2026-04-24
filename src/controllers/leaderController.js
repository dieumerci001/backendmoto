import Comment from "../database/models/Comment.js";
import Attendance from "../database/models/Attendance.js";
import Meeting from "../database/models/Meeting.js";
import User from "../database/models/User.js";
import Group from "../database/models/Group.js";
import GroupMember from "../database/models/GroupMembers.js";
import Moto from "../database/models/Moto.js";
import bcrypt from "bcryptjs";
import * as XLSX from "xlsx";

// dashboard summary
export const getDashboard = async (req, res) => {
  try {
    const totalMeetings = await Meeting.count();
    const totalComments = await Comment.count();
    const totalAttendance = await Attendance.count();
    res.json({ totalMeetings, totalComments, totalAttendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get leader's group members
export const getMyMotaris = async (req, res) => {
  try {
    const group = await Group.findOne({ where: { leaderId: req.user.id } });
    if (!group) return res.json([]);
    const members = await GroupMember.findAll({
      where: { groupId: group.id },
      include: [{ model: User, as: 'motari', attributes: ['id', 'fullName', 'email', 'phone', 'isVerified'] }]
    });
    res.json(members);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// Add single motari manually
export const addMotari = async (req, res) => {
  try {
    const { fullName, email, phone, plateNumber } = req.body;
    const group = await Group.findOne({ where: { leaderId: req.user.id } });
    if (!group) return res.status(400).json({ message: 'You do not have a group. Create one first.' });

    // Check if already exists
    let user = await User.findOne({ where: { phone } });
    if (!user) {
      const tempPassword = bcrypt.hashSync('Moto@1234', 10);
      user = await User.create({
        fullName, email: email || null, phone,
        password: tempPassword,
        role: 'MOTARI', isVerified: true,
        mustChangePassword: true
      });
    }

    // Add to group
    const existing = await GroupMember.findOne({ where: { groupId: group.id, motariId: user.id } });
    if (existing) return res.status(400).json({ message: `${fullName} is already in your group.` });

    await GroupMember.create({ groupId: group.id, motariId: user.id });

    // Add motorcycle
    if (plateNumber) await Moto.create({ plateNumber, status: 'available', UserId: user.id });

    res.status(201).json({ message: `${fullName} added successfully!`, user });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// Upload Excel file of motaris
export const uploadMotaris = async (req, res) => {
  try {
    const group = await Group.findOne({ where: { leaderId: req.user.id } });
    if (!group) return res.status(400).json({ message: 'You do not have a group.' });

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const results = { added: 0, skipped: 0, errors: [] };

    for (const row of rows) {
      try {
        const fullName   = row['Full Name'] || row['fullName'] || row['name'];
        const phone      = String(row['Phone'] || row['phone'] || '');
        const email      = row['Email'] || row['email'] || null;
        const plateNumber = row['Plate Number'] || row['plateNumber'] || row['plate'] || null;

        if (!fullName || !phone) { results.errors.push(`Row skipped: missing name or phone`); continue; }

        let user = await User.findOne({ where: { phone } });
        if (!user) {
          user = await User.create({
            fullName, email, phone,
            password: bcrypt.hashSync('Moto@1234', 10),
            role: 'MOTARI', isVerified: true,
            mustChangePassword: true
          });
        }

        const existing = await GroupMember.findOne({ where: { groupId: group.id, motariId: user.id } });
        if (existing) { results.skipped++; continue; }

        await GroupMember.create({ groupId: group.id, motariId: user.id });
        if (plateNumber) await Moto.create({ plateNumber, status: 'available', UserId: user.id });
        results.added++;
      } catch (rowErr) {
        results.errors.push(`Error on row: ${rowErr.message}`);
      }
    }

    res.json({ message: `Done! Added: ${results.added}, Skipped: ${results.skipped}`, results });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// Remove motari from group
export const removeMotari = async (req, res) => {
  try {
    const group = await Group.findOne({ where: { leaderId: req.user.id } });
    if (!group) return res.status(404).json({ message: 'Group not found' });
    await GroupMember.destroy({ where: { groupId: group.id, motariId: req.params.motariId } });
    res.json({ message: 'Motari removed from group' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// Get or create leader's group
export const getMyGroup = async (req, res) => {
  try {
    let group = await Group.findOne({ where: { leaderId: req.user.id } });
    res.json(group || null);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Group.findOne({ where: { leaderId: req.user.id } });
    if (existing) return res.status(400).json({ message: 'You already have a group.' });
    const group = await Group.create({ name, leaderId: req.user.id });
    res.status(201).json(group);
  } catch (e) { res.status(500).json({ message: e.message }); }
};