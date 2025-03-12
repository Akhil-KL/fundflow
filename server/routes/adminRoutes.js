// routes/adminRoutes.js
import express from "express";
import {
  getAllUsers,
  getAllCampaigns,
  deleteUser,
  deleteCampaign,
} from "../controllers/adminController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔒 Admin-only routes
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.get("/campaigns", protect, authorizeRoles("admin"), getAllCampaigns);

router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);
router.delete("/campaigns/:id", protect, authorizeRoles("admin"), deleteCampaign);

export default router;
