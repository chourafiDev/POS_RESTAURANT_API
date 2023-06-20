import mongoose from "mongoose";
import "dotenv/config";

const MONOG_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_URL = `mongodb+srv://${MONOG_USER}:${MONGO_PASSWORD}@cluster0.mfgwrqv.mongodb.net/?retryWrites=true&w=majority`;

mongoose.Promise = Promise;

mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error) =>
  console.log(`❌ [monogDb error]: ${error}`)
);

export const dbConnect = () => {};
