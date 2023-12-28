import express from "express";
import {
  createUser,
  updateUser,
  getAllUsers,
  deleteUser,
  getUserById,
  getCurrentUser,
} from "../controllers/userContoller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", createUser);
router.get("/", protect, getAllUsers);
router.get("/current-user", protect, getCurrentUser);
router.delete("/:id", protect, deleteUser);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);

export default router;
