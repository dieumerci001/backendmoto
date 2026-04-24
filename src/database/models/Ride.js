// src/models/Ride.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Ride = sequelize.define("Ride", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  passengerId: { type: DataTypes.UUID, allowNull: false },
  motariId:    { type: DataTypes.UUID, allowNull: true },
  pickup:      { type: DataTypes.STRING, allowNull: false },
  destination: { type: DataTypes.STRING, allowNull: false },
  scheduledTime: { type: DataTypes.DATE, allowNull: false },
  price:  { type: DataTypes.INTEGER, defaultValue: 1000 },
  status: {
    type: DataTypes.ENUM("PENDING", "ACCEPTED", "ONGOING", "COMPLETED", "CANCELLED"),
    defaultValue: "PENDING"
  }
});

export default Ride;