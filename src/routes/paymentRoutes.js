import express from "express";
import { stripeCheckoutSession } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/create-checkout-session", protect, stripeCheckoutSession);

export default router;
