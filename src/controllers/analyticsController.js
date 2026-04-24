import { generateMotariReport } from "../services/aiAnalyticsService.js";

export const getMotariReport = async (req, res) => {
  try {
    const report = generateMotariReport(req.body);

    res.json({
      message: "Motari report generated",
      report
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};