import sequelize from "../../config/db.js";
import User from "../models/User.js";

export const createUserTable=async()=>{
    await sequelize.authenticate();
    await User.sync({alter:true, logging: false});
    console.log("Users table created successfully 🔥🔥🔥🔥🔥🔥🔥");
}