import express from "express";
import {
  createTable,
  getAllTables,
  getTableById,
  updateTable,
  deleteTable,
} from "../controllers/tableController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTable);
router.get("/", getAllTables);
router.get("/:id", protect, getTableById);
router.put("/:id", protect, updateTable);
router.delete("/:id", protect, deleteTable);

export default router;
