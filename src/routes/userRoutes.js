import express from "express";
import {
  createUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
} from "../controllers/userContoller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-user", protect, createUser);
router.get("/", protect, getAllUsers);
router.delete("/:id", protect, deleteUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
