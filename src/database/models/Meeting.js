import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Meeting = sequelize.define("Meeting", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  location: DataTypes.STRING,
  date: DataTypes.DATE,
  district: DataTypes.STRING // for district-wide meetings
});

export default Meeting;