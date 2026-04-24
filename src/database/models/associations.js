import User from "./User.js";
import Ride from "./Ride.js";
import Wallet from "./Wallet.js";
import Maintenance from "./Maintenance.js";
import Feedback from "./Feedback.js";
import Group from "./Group.js";
import Availability from "./Availability.js";
import GroupMember from "./GroupMembers.js";
import Moto from "./Moto.js";

// User → Ride
User.hasMany(Ride, { foreignKey: "passengerId", as: "passengerRides" });
Ride.belongsTo(User, { foreignKey: "passengerId", as: "passenger" });
User.hasMany(Ride, { foreignKey: "motariId", as: "motariRides" });
Ride.belongsTo(User, { foreignKey: "motariId", as: "motari" });

// Availability
User.hasOne(Availability, { foreignKey: "motariId" });
Availability.belongsTo(User, { foreignKey: "motariId" });

// GroupMember
GroupMember.belongsTo(User, { foreignKey: "motariId", as: "motari" });
Group.hasMany(GroupMember, { foreignKey: "groupId" });
GroupMember.belongsTo(Group, { foreignKey: "groupId" });

// Moto
User.hasMany(Moto, { foreignKey: "UserId" });
Moto.belongsTo(User, { foreignKey: "UserId" });

// Wallet
User.hasOne(Wallet);
Wallet.belongsTo(User);

// Maintenance
User.hasMany(Maintenance);
Maintenance.belongsTo(User);

// Feedback
User.hasMany(Feedback, { as: "receivedFeedback" });

// Group
Group.belongsTo(User, { as: "leader", foreignKey: "leaderId" });
User.hasOne(Group, { as: "ledGroup", foreignKey: "leaderId" });

export default {};