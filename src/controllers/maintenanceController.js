import Maintenance from "../database/models/Maintenance.js";

// ➤ ADD MAINTENANCE
export const addMaintenance = async (req, res) => {
  try {
    const { type, cost, description, nextServiceDate, motoId } = req.body;

    const record = await Maintenance.create({
      type,
      cost,
      description,
      nextServiceDate,
      motoId
    });

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➤ GET MAINTENANCE HISTORY
export const getMaintenance = async (req, res) => {
  try {
    const records = await Maintenance.findAll({
      where: { motoId: req.params.motoId }
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};