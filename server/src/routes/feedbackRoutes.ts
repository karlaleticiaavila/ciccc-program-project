import { Router } from "express";
import {
  createFeedback,
  getFeedbackByMilestone,
} from "../controllers/feedbackController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/:milestoneId", getFeedbackByMilestone);

router.post("/", authMiddleware, createFeedback);

export default router;