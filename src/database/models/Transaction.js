// src/models/Transaction.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Transaction = sequelize.define("Transaction", {
  amount: DataTypes.INTEGER,
  type: DataTypes.STRING // credit or debit
});

export default Transaction;