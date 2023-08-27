import express from "express";
import {
  getUserProfile,
  login,
  logout,
  forgotPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", protect, getUserProfile);
router.post("/forgot-password", forgotPassword);

export default router;
