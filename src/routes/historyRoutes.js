import express from "express";
import {
  getAllhistories,
  deleteHistory,
  deleteHistories,
  getMyHistory,
} from "../controllers/historiesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllhistories);
router.get("/me", protect, getMyHistory);
router.delete("/:id", protect, deleteHistory);
router.post("/", protect, deleteHistories);

export default router;
