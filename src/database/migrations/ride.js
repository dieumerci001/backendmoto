import sequelize from "../../config/db.js";
import Ride from "../models/Ride.js";

export const createRideTable = async () => {
  try {
    await sequelize.authenticate();

    await Ride.sync({ alter: true, logging: false });

    console.log("Rides table created successfully 🚖");
  } catch (error) {
    console.error("Error creating Rides table:", error);
  }
};