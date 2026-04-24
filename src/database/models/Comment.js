import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Comment = sequelize.define("Comment", {
  message: DataTypes.TEXT,
  rating: DataTypes.INTEGER,
  motariId: DataTypes.INTEGER,
  userId: DataTypes.INTEGER
});

export default Comment;