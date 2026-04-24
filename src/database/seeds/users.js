import bcrypt from "bcryptjs";
import User from "../models/User.js";


export const seedUsers = async () => {
  try {
    const adminPassword = bcrypt.hashSync("hashimweimana", 10);
    const defaultPassword = bcrypt.hashSync("123456", 10);

    await User.findOrCreate({
      where: { email: "umuragwadieumerci@gmail.com" },
      defaults: { fullName: "Admin", phone: "0780000000", password: adminPassword, role: "ADMIN", isVerified: true }
    });
    await User.findOrCreate({
      where: { email: "motari@test.com" },
      defaults: { fullName: "Jean Motari", phone: "0780000001", password: defaultPassword, role: "MOTARI", isVerified: true }
    });
    await User.findOrCreate({
      where: { email: "passenger@test.com" },
      defaults: { fullName: "Amina Passenger", phone: "0780000002", password: defaultPassword, role: "PASSENGER", isVerified: true }
    });

    console.log("Users seeded successfully 🌱🔥");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};