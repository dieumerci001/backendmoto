import Comment from "../database/models/Comment.js";

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { message, rating, motariId } = req.body;

    const comment = await Comment.create({
      message,
      rating,
      motariId,
      userId: req.user.id
    });

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET COMMENTS FOR MOTARI
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { motariId: req.params.motariId }
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};