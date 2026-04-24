import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Maintenance = sequelize.define("Maintenance", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING, // oil, tire, repair
    allowNull: false
  },

  cost: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  description: {
    type: DataTypes.STRING
  },

  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

  nextServiceDate: {
    type: DataTypes.DATE
  },

  motoId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

export default Maintenance;