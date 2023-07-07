import express from "express";
import {
  createUser,
  updateUser,
  getAllUsers,
  deleteUser,
  getUserById,
} from "../controllers/userContoller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createUser);
router.get("/", protect, getAllUsers);
router.delete("/:id", protect, deleteUser);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);

export default router;
