import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import connectDB from "./config/config.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Cors options
const corsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
    "Authorization",
  ],
  credentials: true, // this allows to send back (to client) cookies
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: ["http://localhost:3000", "http://localhost:3001"],
  preflightContinue: false,
};

// Connect to mongoDb
connectDB();

// Initial express app
const PORT = process.env.PORT;
const app = express();

// Initial Middlewares
app.use(compression());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

// Create server
const server = http.createServer(app);

// Run server
server.listen(PORT, () =>
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
);
