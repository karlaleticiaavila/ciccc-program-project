import express from "express";
import { createMilestone, getMilestones,getMilestoneById,updateMilestone,deleteMilestone  } from "../controllers/milestoneController.js";

const router = express.Router();

router.post("/", createMilestone);
router.get("/", getMilestones);
router.get("/:id", getMilestoneById);
router.put("/:id", updateMilestone);
router.delete("/:id", deleteMilestone);

export default router;