import mongoose from "mongoose";
import "dotenv/config";

const MONOG_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const MONGO_URL = `mongodb+srv://${MONOG_USER}:${MONGO_PASSWORD}@cluster0.mfgwrqv.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority
`;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URL);
    console.log(
      `✔️ [MonogDb]: MongoDb Success Connected:  ${conn.connection.host}`
    );
  } catch (error) {
    console.error(`❌[MonogDb]: MongoDb Faild Connected ${error}`);
    process.exit(1);
  }
};

export default connectDB;
