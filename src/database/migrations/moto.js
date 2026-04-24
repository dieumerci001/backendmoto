import sequelize from "../../config/db.js";
import Motorcycle from "../models/Moto.js";


export const createMotorcycleTable = async () => {
  try {
    await sequelize.authenticate();

    await Motorcycle.sync({ alter: true, logging: false });

    console.log("Motorcycles table created successfully 🏍");
  } catch (error) {
    console.error("Error creating Motorcycles table:", error);
  }
};