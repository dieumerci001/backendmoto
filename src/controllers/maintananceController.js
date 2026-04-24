import Maintenance from "../database/models/Maintenance.js";

export const addMaintenance = async (req, res) => {
  const { type, cost, description, nextServiceDate, motoId } = req.body;

  const record = await Maintenance.create({
    type,
    cost,
    description,
    nextServiceDate,
    motoId
  });

  res.json(record);
};

export const getMaintenance = async (req, res) => {
  const records = await Maintenance.findAll({
    where: { motoId: req.params.motoId }
  });

  res.json(records);
};