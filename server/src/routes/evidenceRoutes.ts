import express from "express";
import { createEvidence, getEvidence , getEvidenceById, updateEvidence, deleteEvidence} from "../controllers/evidenceController.js";

const router = express.Router();

router.post("/", createEvidence);
router.get("/", getEvidence);
router.get("/:id", getEvidenceById);
router.put("/:id", updateEvidence);
router.delete("/:id", deleteEvidence);

export default router;