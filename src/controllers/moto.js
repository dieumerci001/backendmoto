import Motorcycle from "../database/models/Moto.js";

/**
 * CREATE MOTORCYCLE
 * Rider registers their motorcycle
 */
export const createMotorcycle = async (req, res) => {
  try {
    const { plateNumber, ownerName } = req.body;

    // Create motorcycle linked to logged-in user
    const motorcycle = await Motorcycle.create({
      plateNumber,
      ownerName,
      userId: req.user.id,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      message: "Motorcycle registered successfully",
      motorcycle
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * VERIFY MOTORCYCLE
 * Only admin can verify a motorcycle
 */
export const verifyMotorcycle = async (req, res) => {
  try {
    const { id } = req.params;

    // Find motorcycle
    const motorcycle = await Motorcycle.findByPk(id);

    if (!motorcycle) {
      return res.status(404).json({ message: "Motorcycle not found" });
    }

    // Update status
    motorcycle.status = "verified";
    motorcycle.updatedAt = new Date();

    await motorcycle.save();

    res.json({
      message: "Motorcycle verified successfully",
      motorcycle
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET ALL MOTORCYCLES
 */
export const getAllMotorcycles = async (req, res) => {
  try {
    const motorcycles = await Motorcycle.findAll();

    res.json(motorcycles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};