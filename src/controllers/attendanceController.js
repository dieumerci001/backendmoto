import Attendance from "../database/models/Attendance.js";

// mark attendance
export const markAttendance = async (req, res) => {
  try {
    const { meetingId, motariId, status } = req.body;

    const record = await Attendance.create({
      meetingId,
      motariId,
      status
    });

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get attendance for meeting
export const getAttendance = async (req, res) => {
  try {
    const records = await Attendance.findAll({
      where: { meetingId: req.params.meetingId }
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};