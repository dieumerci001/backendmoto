import User from "../database/models/User.js";

export const getBalance = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    res.json({
      balance: user.balance
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    const user = await User.findByPk(req.user.id);

    user.balance = (user.balance || 0) + amount;

    await user.save();

    res.json({
      message: "Money added successfully",
      balance: user.balance
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const withdrawMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    const user = await User.findByPk(req.user.id);

    if (user.balance < amount) {
      return res.status(400).json({
        message: "Not enough balance"
      });
    }

    user.balance -= amount;

    await user.save();

    res.json({
      message: "Withdrawal successful",
      balance: user.balance
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};