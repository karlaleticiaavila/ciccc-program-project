import "dotenv/config";

import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import milestoneRoutes from "./routes/milestoneRoutes.js";
import evidenceRoutes from "./routes/evidenceRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

const app = express();
const server = http.createServer(app);

const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:3000";

export const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/evidence", evidenceRoutes);
app.use("/api/feedback", feedbackRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("Who Are You Becoming API 🚀");
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

connectDB();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});