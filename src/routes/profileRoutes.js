import express from "express";
import {
  getCurrentUser,
  updateCurrentUser,
} from "../controllers/profileContoller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCurrentUser);
router.put("/", protect, updateCurrentUser);

export default router;
