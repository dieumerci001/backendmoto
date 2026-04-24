import sequelize from "../config/db.js";
import { seedUsers } from "../database/seeds/users.js";

await sequelize.sync();
await seedUsers();
console.log("Seeding done ✅");
process.exit();
