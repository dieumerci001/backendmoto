import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Group = sequelize.define("Group", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  leaderId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

export default Group;