import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

class Payment extends Model {}

Payment.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  status: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['success', 'failed']]
    }
  },

  motorcycleId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },

  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }

}, {
  sequelize,
  modelName: "Payment",
  tableName: "payments",
  timestamps: true
});

export default Payment;