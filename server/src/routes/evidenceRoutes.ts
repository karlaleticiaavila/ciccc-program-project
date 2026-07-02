import express from "express";
import { createEvidence, getEvidence } from "../controllers/evidenceController.js";

const router = express.Router();

router.post("/", createEvidence);
router.get("/", getEvidence);

export default router;