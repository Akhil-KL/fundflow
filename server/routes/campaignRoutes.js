import express from "express";
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  deleteCampaign,
  updateCampaign,
} from "../controllers/campaignController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🆓 Public: Get all campaigns
router.get("/", getCampaigns);

// 🆓 Public: Get single campaign by ID
router.get("/:id", getCampaignById);

// 🔒 Protected: Only universities can create campaigns
router.post("/", protect, authorizeRoles('university'), createCampaign);

// 🔒 Protected: Only campaign owner or admin can update campaign (can extend later)
router.put("/:id", protect, authorizeRoles('university', 'admin'), updateCampaign);

// 🔒 Protected: Only admin can delete campaign
router.delete("/:id", protect, authorizeRoles('admin'), deleteCampaign);

export default router;
