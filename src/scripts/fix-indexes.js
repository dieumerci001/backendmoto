import sequelize from "../config/db.js";

// Get all indexes on Users table
const [indexes] = await sequelize.query("SHOW INDEX FROM `Users`");

// Group by column, keep only the first, drop the rest
const seen = {};
for (const idx of indexes) {
  const key = idx.Key_name;
  if (key === "PRIMARY") continue;
  if (seen[key]) {
    await sequelize.query(`ALTER TABLE \`Users\` DROP INDEX \`${key}\``);
    console.log("Dropped duplicate index:", key);
  } else {
    seen[key] = true;
  }
}

console.log("Done cleaning indexes ✅");
process.exit();
