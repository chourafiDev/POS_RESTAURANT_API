import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getOrders } from "../controllers/orderController.js";

const router = express.Router();

router.get("/", protect, getOrders);

export default router;
