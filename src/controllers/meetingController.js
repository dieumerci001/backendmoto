import Meeting from "../database/models/Meeting.js";

// CREATE MEETING
export const createMeeting = async (req, res) => {
  try {
    const { title, description, location, date, district } = req.body;

    const meeting = await Meeting.create({
      title,
      description,
      location,
      date,
      district
    });

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL MEETINGS
export const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.findAll();
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 