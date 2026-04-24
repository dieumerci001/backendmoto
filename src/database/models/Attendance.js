import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Attendance = sequelize.define("Attendance", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  meetingId: DataTypes.UUID,
  motariId: DataTypes.UUID,
  status: {
    type: DataTypes.STRING,
    defaultValue: "PRESENT" // or ABSENT
  }
});

export default Attendance;