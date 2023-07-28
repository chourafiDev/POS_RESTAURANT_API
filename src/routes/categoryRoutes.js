import express from "express";
import {
  createCategory,
  getAllCategories,
  deleteCategorie,
  updateCategorie,
  getCategorieById,
} from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createCategory);
router.get("/", protect, getAllCategories);
router.delete("/:id", protect, deleteCategorie);
router.get("/:id", protect, getCategorieById);
router.put("/:id", protect, updateCategorie);

export default router;
