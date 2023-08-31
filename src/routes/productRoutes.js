import express from "express";
import {
  createProduct,
  getAllProducts,
  deleteProduct,
  getProductById,
  updateProduct,
  getMenu,
} from "../controllers/productContoller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createProduct);
router.get("/", protect, getAllProducts);
router.get("/menu/:title", protect, getMenu);
router.get("/:id", protect, getProductById);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
