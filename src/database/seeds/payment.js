import Payment from "../models/payment.js";
import Motorcycle from "../models/Moto.js";

/**
 * Seed Payments Table
 */
export const seedPayments = async () => {
  try {
    // Get a motorcycle
    const moto = await Motorcycle.findOne();

    if (!moto) {
      console.log("No motorcycle found, skipping payment seeding");
      return;
    }

    await Payment.bulkCreate([
      {
        amount: 500,
        status: "success",
        motorcycleId: moto.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        amount: 300,
        status: "failed",
        motorcycleId: moto.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log("Payments seeded successfully 💳🔥");
  } catch (error) {
    console.error("Error seeding payments:", error);
  }
};