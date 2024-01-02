import express from "express";
import {
  stripeCheckoutSession,
  webHookCheckout,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/create-checkout-session", protect, stripeCheckoutSession);
router.post("/webhook", webHookCheckout);

export default router;
