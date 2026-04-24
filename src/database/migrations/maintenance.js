import sequelize from "../../config/db.js";
import Maintenance from "../models/Maintenance.js";

export const createMaintenanceTable = async () => {
  try {
    await sequelize.authenticate();

    await Maintenance.sync({ alter: true, logging: false });

    console.log("Maintenance table created successfully 🛠");
  } catch (error) {
    console.error("Error creating Maintenance table:", error);
  }
};