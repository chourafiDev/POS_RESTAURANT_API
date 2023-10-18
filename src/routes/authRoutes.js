import express from "express";
import {
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

export default router;
