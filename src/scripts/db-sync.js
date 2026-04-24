import { createUserTable } from "../database/migrations/users.js";
import { createMotorcycleTable } from "../database/migrations/moto.js";
import { createRideTable } from "../database/migrations/ride.js";
import { createWalletTable } from "../database/migrations/wallet.js";
import { createPaymentTable } from "../database/migrations/payment.js";
import { createMaintenanceTable } from "../database/migrations/maintenance.js";
import { createGroupTable } from "../database/migrations/group.js";
import { createGroupMemberTable } from "../database/migrations/groupMember.js";

const syncDB = async () => {
  try {
    await createUserTable();
    await createMotorcycleTable();
    await createRideTable();
    await createWalletTable();
    await createPaymentTable();
    await createMaintenanceTable();
    await createGroupTable();
    await createGroupMemberTable();

    console.log("🔥 All tables created successfully!");
    process.exit();
  } catch (error) {
    console.error("DB Sync Error:", error);
    process.exit(1);
  }
};

syncDB();

