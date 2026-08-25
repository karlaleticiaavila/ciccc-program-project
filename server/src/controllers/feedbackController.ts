import { Request, Response } from "express";
import Feedback from "../models/Feedback.js";
import Milestone from "../models/Milestone.js";
import { io } from "../server.js";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const createFeedback = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { milestoneId, message } = req.body;

    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const milestone = await Milestone.findOne({
      _id: milestoneId,
      isPublic: true,
    });

    if (!milestone) {
      return res.status(404).json({
        message: "Public milestone not found",
      });
    }

    const feedback = await Feedback.create({
      milestoneId,
      mentorId: req.user.userId,
      message,
    });

    const populatedFeedback = await feedback.populate(
  "mentorId",
  "name email profilePicture"
);


console.log("EMITTING feedbackCreated", {
  milestoneId,
  connectedClients: io.engine.clientsCount,
});

io.emit("feedbackCreated", {
  milestoneId,
  feedback: populatedFeedback,
});

return res.status(201).json(populatedFeedback);
  } catch (error) {
    console.error("Error creating feedback:", error);

    return res.status(500).json({
      message: "Error creating feedback",
    });
  }
};

export const getFeedbackByMilestone = async (
  req: Request,
  res: Response
) => {
  try {
    const { milestoneId } = req.params;

    const feedback = await Feedback.find({
      milestoneId,
    })
      .populate("mentorId", "name email profilePicture")
      .sort({ createdAt: -1 });

    return res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);

    return res.status(500).json({
      message: "Error fetching feedback",
    });
  }
};