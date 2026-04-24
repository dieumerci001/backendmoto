import sequelize from "../config/db.js";
import User from "../database/models/User.js";

await sequelize.sync();

const updated = await User.update(
  { isVerified: true, role: "ADMIN" },
  { where: { email: "umuragwadieumerci@gmail.com" } }
);

console.log("Updated rows:", updated[0]);
const admin = await User.findOne({ where: { email: "umuragwadieumerci@gmail.com" } });
console.log("Admin isVerified:", admin.isVerified, "| role:", admin.role);
process.exit();
