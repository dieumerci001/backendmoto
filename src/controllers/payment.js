import Payment from "../database/models/payment.js";
import Motorcycle from "../database/models/Moto.js";

/**
 * CREATE PAYMENT
 * Payment is made only for verified motorcycles
 */
export const createPayment = async (req, res) => {
  try {
    const { motorcycleId, amount } = req.body;

    // Check if motorcycle exists
    const motorcycle = await Motorcycle.findByPk(motorcycleId);

    if (!motorcycle) {
      return res.status(404).json({ message: "Motorcycle not found" });
    }

    // Ensure motorcycle is verified
    if (motorcycle.status !== "verified") {
      return res.status(400).json({
        message: "Motorcycle must be verified before payment"
      });
    }

    // Create payment
    const payment = await Payment.create({
      motorcycleId,
      amount,
      status: "success",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      message: "Payment successful",
      payment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET ALL PAYMENTS
 */
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};