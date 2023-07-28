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

router.post("/", createTable);
router.get("/", getAllTables);
router.get("/:id", getTableById);
router.put("/:id", updateTable);
router.delete("/:id", deleteTable);

export default router;
