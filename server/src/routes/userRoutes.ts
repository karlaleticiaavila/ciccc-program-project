import express from "express";
import {
  createUser,
  getUsers,
  syncGoogleUser,
  syncAppleUser,
  registerWithEmail,
  loginWithEmail,
} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/", createUser);

router.post("/sync", syncGoogleUser);

router.post("/sync-apple", syncAppleUser);

router.post("/register", registerWithEmail);

router.post("/login", loginWithEmail);

router.get("/", getUsers);

export default router;