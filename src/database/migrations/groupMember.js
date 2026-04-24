import sequelize from "../../config/db.js";
import GroupMember from "../models/GroupMembers.js";

export const createGroupMemberTable = async () => {
  try {
    await sequelize.authenticate();

    await GroupMember.sync({ alter: true, logging: false });

    console.log("Group Members table created successfully 👥");
  } catch (error) {
    console.error("Error creating GroupMember table:", error);
  }
};