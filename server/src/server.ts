import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import milestoneRoutes from "./routes/milestoneRoutes.js";
import evidenceRoutes from "./routes/evidenceRoutes.js";


dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/evidence", evidenceRoutes);
app.get("/", (_req: Request, res: Response) => {
  res.send("Who Are You Becoming API 🚀");
});

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});