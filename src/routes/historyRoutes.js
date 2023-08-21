import express from "express";
import { getAllhistories } from "../controllers/historiesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllhistories);
// router.delete("/:id", protect, deleteProduct);

export default router;
