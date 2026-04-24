import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const GroupMember = sequelize.define("GroupMember", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  groupId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  motariId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: "ACTIVE" // ACTIVE, SUSPENDED
  }
});

export default GroupMember;