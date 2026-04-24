// import { DataTypes, Model } from "sequelize";
// import sequelize from "../../config/db.js";

// class User extends Model {}

// User.init({
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     allowNull: false,
//     primaryKey: true
//   },

//   fullName: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },

//   email: {
//     type: DataTypes.STRING,
//     allowNull: true,
//     unique: true
//   },

//   password: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },

//   phoneNumber: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },

//   role: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     defaultValue: "rider",
//     validate: {
//       isIn: [['rider', 'admin']]
//     }
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
//   modelName: "User",
//   tableName: "users",
//   timestamps: true
// });

//  export default User;