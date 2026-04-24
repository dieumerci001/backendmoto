// src/models/Feedback.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Feedback = sequelize.define("Feedback", {
  rating: DataTypes.INTEGER,
  comment: DataTypes.TEXT
});

export default Feedback;