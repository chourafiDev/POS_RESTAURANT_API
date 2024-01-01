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
import profileRoutes from "./routes/profileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// Cors options
const corsConfig = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
    "Authorization",
  ],
  credentials: true, // this allows to send back (to client) cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://pos-restaurant-plum.vercel.app",
  ],
  preflightContinue: false,
};

// Connect to mongoDb
connectDB();

// Initial express app
const PORT = 8080 || process.env.PORT;
const app = express();

// Initial Middlewares
app.use(compression());
app.use(cookieParser());
app.use(cors(corsConfig));
app.options("", cors(corsConfig));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/payments", paymentRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

// Create server
const server = http.createServer(app);

// Run server
server.listen(PORT, () =>
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
);
