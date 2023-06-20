import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
// import { dbConnect } from "./config/config.js";

const PORT = process.env.PORT;
 
// Initial express app
const app = express();

// Initial Middlewares
app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Connect to mongoDb
// dbConnect();

// Define routes
app.get("/", (req, res) => {
  res.send("Express + TypeScript Server is running by nodemon.");
});

// Create server
const server = http.createServer(app);

// Run server
server.listen(PORT, () =>
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
);
