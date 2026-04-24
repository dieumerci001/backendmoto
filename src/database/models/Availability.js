import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Availability = sequelize.define("Availability", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  motariId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  // 0=Sun,1=Mon,...,6=Sat  stored as JSON array e.g. [1,2,3,4,5]
  days: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [1, 2, 3, 4, 5]
  },
  startHour: {
    type: DataTypes.INTEGER, // 0-23
    allowNull: false,
    defaultValue: 7
  },
  endHour: {
    type: DataTypes.INTEGER, // 0-23
    allowNull: false,
    defaultValue: 18
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true // e.g. "Kigali", "Northern Province"
  },
  status: {
    type: DataTypes.ENUM("ONLINE", "OFFLINE", "BUSY"),
    defaultValue: "ONLINE"
  }
});

export default Availability;
