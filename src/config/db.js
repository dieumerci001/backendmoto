import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();


const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: 3306,
        dialectOptions: {
            connectTimeout: 60000
        },
        logging: false
    }
)

export const connectToDatabase = async ()=>{
  try{
     await sequelize.authenticate();
     console.log('connection has been established');
     return { success:true , message: 'connection to database has been successful'}
    }
    catch (error){
        console.error('unable to connect to the database:', error);
        return { success:false , message: 'connection failed'}

    }
}
export default sequelize

    


