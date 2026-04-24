import bcrypt from "bcryptjs";
import sequelize from "../config/db.js";
import User from "../database/models/User.js";

await sequelize.sync();

const hashed = bcrypt.hashSync("hashimweimana", 10);
await User.update({ password: hashed }, { where: { email: "umuragwadieumerci@gmail.com" } });

const admin = await User.findOne({ where: { email: "umuragwadieumerci@gmail.com" } });
const check = bcrypt.compareSync("hashimweimana", admin.password);
console.log("Password reset. Match test:", check);
process.exit();
