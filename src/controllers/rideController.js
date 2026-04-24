import { Op } from "sequelize";
import sequelize from "../config/db.js";
import Ride from "../database/models/Ride.js";
import User from "../database/models/User.js";
import Availability from "../database/models/Availability.js";

// ── RWANDA LOCATIONS ─────────────────────────────────────────
export const LOCATIONS = [
  "Kigali", "Northern Province", "Southern Province",
  "Eastern Province", "Western Province"
];

// ── MOTARI: set/update availability + location + status ──────
export const setAvailability = async (req, res) => {
  try {
    const { days, startHour, endHour, location, status } = req.body;
    const [avail] = await Availability.findOrCreate({
      where: { motariId: req.user.id },
      defaults: { motariId: req.user.id, days, startHour, endHour, location, status: status || "ONLINE", isActive: true }
    });
    await avail.update({ days, startHour, endHour, location, status: status || avail.status, isActive: true });
    res.json(avail);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── MOTARI: toggle online/offline quickly ────────────────────
export const setStatus = async (req, res) => {
  try {
    const { status } = req.body; // ONLINE | OFFLINE | BUSY
    const avail = await Availability.findOne({ where: { motariId: req.user.id } });
    if (!avail) return res.status(404).json({ message: "Set your availability first" });
    await avail.update({ status });
    res.json({ status });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── PASSENGER: auto-assign best available Motari ─────────────
export const bookRide = async (req, res) => {
  try {
    const { pickup, destination, scheduledTime, location } = req.body;
    const passengerId = req.user.id;
    const date = new Date(scheduledTime);
    const day  = date.getDay();
    const hour = date.getHours();

    // 1. Find all ONLINE Motari in same location with matching availability
    const availabilities = await Availability.findAll({
      where: {
        isActive: true,
        status: "ONLINE",
        location: location,
      }
    });

    if (availabilities.length === 0)
      return res.status(400).json({ message: `No Motari available in ${location}. Try another location or time.` });

    // 2. Filter by working day & hour
    const workingNow = availabilities.filter(a =>
      a.days.includes(day) && hour >= a.startHour && hour < a.endHour
    );

    if (workingNow.length === 0)
      return res.status(400).json({ message: `No Motari in ${location} works at that time. Try a different time.` });

    // 3. Filter out Motari with conflicting rides (within 1 hour)
    const freeMotari = [];
    for (const a of workingNow) {
      const conflict = await Ride.findOne({
        where: {
          motariId: a.motariId,
          status: { [Op.in]: ["PENDING", "ACCEPTED", "ONGOING"] },
          scheduledTime: {
            [Op.between]: [
              new Date(date.getTime() - 60 * 60 * 1000),
              new Date(date.getTime() + 60 * 60 * 1000)
            ]
          }
        }
      });
      if (!conflict) freeMotari.push(a.motariId);
    }

    if (freeMotari.length === 0)
      return res.status(400).json({ message: `All Motari in ${location} are busy at that time. Try a different time.` });

    // 4. Pick the one with FEWEST rides today (fairness)
    const todayStart = new Date(date); todayStart.setHours(0, 0, 0, 0);
    const todayEnd   = new Date(date); todayEnd.setHours(23, 59, 59, 999);

    const rideCounts = await Promise.all(
      freeMotari.map(async (motariId) => {
        const count = await Ride.count({
          where: {
            motariId,
            scheduledTime: { [Op.between]: [todayStart, todayEnd] },
            status: { [Op.notIn]: ["CANCELLED"] }
          }
        });
        return { motariId, count };
      })
    );

    // Sort by fewest rides → pick first
    rideCounts.sort((a, b) => a.count - b.count);
    const assignedMotariId = rideCounts[0].motariId;

    // 5. Create the ride
    const ride = await Ride.create({
      passengerId,
      motariId: assignedMotariId,
      pickup,
      destination,
      scheduledTime: date,
      status: "PENDING"
    });

    // 6. Notify Motari via socket
    const io = req.app.get("io");
    io.emit(`motari_${assignedMotariId}`, { event: "newBooking", ride });

    // Get motari name for response
    const motari = await User.findByPk(assignedMotariId, { attributes: ["fullName", "phone"] });

    res.status(201).json({
      message: `Motari assigned successfully!`,
      motari: motari,
      ride
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── MOTARI: see their incoming booking requests ───────────────
export const getMyBookings = async (req, res) => {
  try {
    const rides = await Ride.findAll({
      where: { motariId: req.user.id, status: "PENDING" },
      include: [{ model: User, as: "passenger", attributes: ["fullName", "phone"] }],
      order: [["scheduledTime", "ASC"]]
    });
    res.json(rides);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── MOTARI: today's full schedule ─────────────────────────────
export const getTodaySchedule = async (req, res) => {
  try {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end   = new Date(); end.setHours(23, 59, 59, 999);
    const rides = await Ride.findAll({
      where: {
        motariId: req.user.id,
        scheduledTime: { [Op.between]: [start, end] },
        status: { [Op.in]: ["PENDING", "ACCEPTED", "ONGOING", "COMPLETED"] }
      },
      include: [{ model: User, as: "passenger", attributes: ["fullName", "phone"] }],
      order: [["scheduledTime", "ASC"]]
    });
    res.json(rides);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── MOTARI: accept a booking ──────────────────────────────────
export const acceptBooking = async (req, res) => {
  try {
    const ride = await Ride.findByPk(req.params.id);
    if (!ride || ride.motariId !== req.user.id) return res.status(404).json({ message: "Ride not found" });
    if (ride.status !== "PENDING") return res.status(400).json({ message: "Ride already handled" });
    ride.status = "ACCEPTED";
    await ride.save();
    const io = req.app.get("io");
    io.emit(`passenger_${ride.passengerId}`, { event: "rideAccepted", ride });
    res.json(ride);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── MOTARI: decline a booking ─────────────────────────────────
export const declineBooking = async (req, res) => {
  try {
    const ride = await Ride.findByPk(req.params.id);
    if (!ride || ride.motariId !== req.user.id) return res.status(404).json({ message: "Ride not found" });
    ride.status = "CANCELLED";
    await ride.save();

    // Re-assign to next available Motari in same location
    const avail = await Availability.findOne({ where: { motariId: req.user.id } });
    if (avail) {
      const others = await Availability.findAll({
        where: { location: avail.location, status: "ONLINE", isActive: true, motariId: { [Op.ne]: req.user.id } }
      });
      if (others.length > 0) {
        const newMotariId = others[0].motariId;
        const newRide = await Ride.create({
          passengerId: ride.passengerId,
          motariId: newMotariId,
          pickup: ride.pickup,
          destination: ride.destination,
          scheduledTime: ride.scheduledTime,
          status: "PENDING"
        });
        const io = req.app.get("io");
        io.emit(`motari_${newMotariId}`, { event: "newBooking", newRide });
      }
    }
    res.json({ message: "Booking declined. Reassigning to another Motari." });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── PASSENGER: their ride history ────────────────────────────
export const getMyRides = async (req, res) => {
  try {
    const rides = await Ride.findAll({
      where: { passengerId: req.user.id },
      include: [{ model: User, as: "motari", attributes: ["fullName", "phone"] }],
      order: [["scheduledTime", "DESC"]]
    });
    res.json(rides);
  } catch (e) { res.status(500).json({ message: e.message }); }
};
