import Motorcycle from "../models/Moto.js";
import User from "../models/users.js";


export const seedMotorcycles = async () => {
  try {
    // Get a rider from DB
    const rider = await User.findOne({ where: { role: "rider" } });

    if (!rider) {
      console.log("No rider found, skipping motorcycle seeding");
      return;
    }

    await Motorcycle.bulkCreate([
      {
        plateNumber: "RAB123A",
        ownerName: "Sample Rider",
        status: "pending",
        userId: rider.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        plateNumber: "RAC456B",
        ownerName: "Sample Rider",
        status: "verified",
        userId: rider.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log("Motorcycles seeded successfully 🏍🔥");
  } catch (error) {
    console.error("Error seeding motorcycles:", error);
  }
};