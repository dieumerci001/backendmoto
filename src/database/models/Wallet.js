// src/models/Wallet.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Wallet = sequelize.define("Wallet", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  balance: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

export default Wallet;