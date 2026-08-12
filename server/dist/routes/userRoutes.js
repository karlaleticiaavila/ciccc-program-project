import express from "express";
import { createUser, getUsers, syncGoogleUser, } from "../controllers/userControllers.js";
const router = express.Router();
router.post("/", createUser);
router.post("/sync", syncGoogleUser);
router.get("/", getUsers);
export default router;
