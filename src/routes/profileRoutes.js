import express from "express";
import {
  getCurrentUser,
  updateCurrentUser,
  updateProfileImage,
  updateProfilePassword,
} from "../controllers/profileContoller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCurrentUser);
router.put("/", protect, updateCurrentUser);
router.put("/image-profile", protect, updateProfileImage);
router.put("/update-passworde-profile", protect, updateProfilePassword);

export default router;
