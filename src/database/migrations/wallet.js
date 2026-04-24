import sequelize from "../../config/db.js";
import User from "../models/User.js";

export const createWalletTable = async () => {
  try {
    await sequelize.authenticate();

    // Wallet is inside User model (balance field)
    await User.sync({ alter: true, logging: false });

    console.log("Wallet (User balance) ready 💰");
  } catch (error) {
    console.error("Error creating Wallet:", error);
  }
};