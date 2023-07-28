import express from "express";
import {
  getUserProfile,
  login,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", protect, getUserProfile);

export default router;
