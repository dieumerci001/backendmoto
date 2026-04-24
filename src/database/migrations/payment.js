import sequelize from "../../config/db.js";
import Payment from "../models/Payment.js";

export const createPaymentTable = async () => {
  try {
    await sequelize.authenticate();

    await Payment.sync({ alter: true, logging: false });

    console.log("Payments table created successfully 💰");
  } catch (error) {
    console.error("Error creating Payments table:", error);
  }
};