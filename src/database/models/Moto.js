// import { DataTypes, Model } from "sequelize";
// import sequelize from "../../config/db.js";

// class Motorcycle extends Model {}

// Motorcycle.init({
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true
//   },

//   plateNumber: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
//   },

//   ownerName: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },

//   status: {
//     type: DataTypes.STRING,
//     defaultValue: "pending",
//     validate: {
//       isIn: [['pending', 'verified']]
//     }
//   },

//   userId: {
//     type: DataTypes.UUID,
//     allowNull: false
//   },

//   createdAt: {
//     type: DataTypes.DATE,
//     allowNull: false
//   },

//   updatedAt: {
//     type: DataTypes.DATE,
//     allowNull: false
//   }

// }, {
//   sequelize,
//   modelName: "Motorcycle",
//   tableName: "motorcycles",
//   timestamps: true
// });

// export default Motorcycle;

// src/models/Moto.js


import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Moto = sequelize.define("Moto", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  plateNumber: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    defaultValue: "available"
  }
});

export default Moto;