import express from "express";
import {
  createProduct,
  getAllProducts,
  deleteProduct,
  getProductById,
} from "../controllers/productContoller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createProduct);
router.get("/", protect, getAllProducts);
router.get("/:id", protect, getProductById);
router.delete("/:id", protect, deleteProduct);

export default router;
