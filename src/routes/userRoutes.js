import express from "express";
import {
  createUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userContoller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-user", createUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
