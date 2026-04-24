import sequelize from "../config/db.js";
import "../database/models/associations.js";
import bcrypt from "bcryptjs";
import User from "../database/models/User.js";

// Disable FK checks, drop all, re-create, re-enable
await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
await sequelize.sync({ force: true });
await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

console.log("All tables recreated with UUID ✅");

// Re-seed admin
await User.create({
  fullName: "Admin",
  email: "umuragwadieumerci@gmail.com",
  phone: "0780000000",
  password: bcrypt.hashSync("hashimweimana", 10),
  role: "ADMIN",
  isVerified: true,
});

const admin = await User.findOne({ where: { email: "umuragwadieumerci@gmail.com" } });
console.log("Admin created:", { id: admin.id, role: admin.role, isVerified: admin.isVerified });
process.exit();
