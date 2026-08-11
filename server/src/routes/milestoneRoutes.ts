import express from "express";

import {
  createMilestone,
  getMilestones,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
  updateMilestoneVisibility,
  getPublicMilestoneById,
} from "../controllers/milestoneController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route - no authentication required
router.get("/public/:id", getPublicMilestoneById);

// Authenticated routes
router.post("/", authMiddleware, createMilestone);
router.get("/", authMiddleware, getMilestones);

router.patch(
  "/:id/visibility",
  authMiddleware,
  updateMilestoneVisibility
);

router.get("/:id", authMiddleware, getMilestoneById);
router.put("/:id", authMiddleware, updateMilestone);
router.delete("/:id", authMiddleware, deleteMilestone);

export default router;