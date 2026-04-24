import sequelize from "../../config/db.js";
import Group from "../models/Group.js";

export const createGroupTable = async () => {
  try {
    await sequelize.authenticate();

    await Group.sync({ alter: true, logging: false });

    console.log("Groups table created successfully 👑");
  } catch (error) {
    console.error("Error creating Groups table:", error);
  }
};