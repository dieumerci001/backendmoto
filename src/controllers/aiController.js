import Comment from "../database/models/Comment.js";


export const chatWithAI = async (req, res) => {
  try {
    const {
      message,
      kmPerDay,
      fuelConsumptionPerKm,
      fuelPrice,
      earnings,
      expenses
    } = req.body;

    // 🔥 SAFE CALCULATION INSIDE FUNCTION
    const weeklyFuel = kmPerDay * 7 * fuelConsumptionPerKm;
    const weeklyFuelCost = weeklyFuel * fuelPrice;

    const reply = `
Weekly fuel needed: ${weeklyFuel.toFixed(2)} liters
Weekly fuel cost: ${weeklyFuelCost.toFixed(0)} RWF
Profit: ${(earnings - expenses)} RWF
    `;

    res.json({ reply });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const analyzeBehavior = async (req, res) => {
  try {
    const { motariId } = req.params;

    const comments = await Comment.findAll({
      where: { motariId }
    });

    let totalRating = 0;

    comments.forEach(c => {
      totalRating += c.rating;
    });

    const avgRating = comments.length
      ? totalRating / comments.length
      : 0;

    let advice = "";

    if (avgRating >= 4) {
      advice = "Excellent performance. Keep it up!";
    } else if (avgRating >= 2) {
      advice = "Average performance. Improve customer care.";
    } else {
      advice = "Poor behavior. Immediate improvement needed.";
    }

    res.json({
      totalComments: comments.length,
      avgRating,
      advice
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};