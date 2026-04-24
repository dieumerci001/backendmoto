import Feedback from "../database/models/Feedback.js";

export const addFeedback = async (req, res) => {
  const { rating, comment, motariId } = req.body;

  const feedback = await Feedback.create({
    rating,
    comment,
    motariId
  });

  res.json(feedback);
};