import express from "express";
import {
  createUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} from "../controllers/userContoller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-user", protect, createUser);
router.get("/", protect, getAllUsers);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
