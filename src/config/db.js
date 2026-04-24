import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// Support Render's DATABASE_URL (Postgres) or legacy MySQL env vars
let sequelize;
if (process.env.DATABASE_URL) {
    // If DATABASE_URL exists prefer it (Render provides a full Postgres URL)
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Render's managed Postgres requires this in some setups
            }
        },
        logging: false
    });
} else {
    // Fallback to explicit MySQL connection (local dev)
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST || 'localhost',
            dialect: 'mysql',
            port: process.env.DB_PORT || 3306,
            dialectOptions: {
                connectTimeout: 60000
            },
            logging: false
        }
    );
}

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

    


