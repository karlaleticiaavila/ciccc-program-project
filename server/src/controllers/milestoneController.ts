import { Response } from "express";

import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import Milestone from "../models/Milestone.js";
import { io } from "../server.js";

export const createMilestone = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { title, description, date, category } = req.body;

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const milestone = await Milestone.create({
      title,
      description,
      date,
      category,
      userId,
    });

    io.emit("milestoneCreated", milestone);

    res.status(201).json({
      message: "Milestone created successfully",
      milestone,
    });
  } catch (error) {
    console.error("Error creating milestone:", error);

    res.status(500).json({
      message: "Error creating milestone",
    });
  }
};

export const getMilestones = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const milestones = await Milestone.find({
      userId,
    }).sort({ date: 1 });

    res.status(200).json(milestones);
  } catch (error) {
    console.error("Error getting milestones:", error);

    res.status(500).json({
      message: "Error getting milestones",
    });
  }
};

export const getMilestoneById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const milestone = await Milestone.findOne({
      _id: req.params.id,
      userId,
    });

    if (!milestone) {
      res.status(404).json({
        message:
          "Milestone not found or you do not have permission",
      });
      return;
    }

    res.status(200).json(milestone);
  } catch (error) {
    console.error("Error getting milestone:", error);

    res.status(500).json({
      message: "Error getting milestone",
    });
  }
};

export const updateMilestone = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { title, description, date, category } = req.body;

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const milestone = await Milestone.findOneAndUpdate(
      {
        _id: req.params.id,
        userId,
      },
      {
        title,
        description,
        date,
        category,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!milestone) {
      res.status(404).json({
        message:
          "Milestone not found or you do not have permission",
      });
      return;
    }

    io.emit("milestoneUpdated", milestone);

    res.status(200).json({
      message: "Milestone updated successfully",
      milestone,
    });
  } catch (error) {
    console.error("Error updating milestone:", error);

    res.status(500).json({
      message: "Error updating milestone",
    });
  }
};

export const deleteMilestone = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const milestone = await Milestone.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!milestone) {
      res.status(404).json({
        message:
          "Milestone not found or you do not have permission",
      });
      return;
    }

    io.emit("milestoneDeleted", {
      milestoneId: milestone._id,
      userId,
    });

    res.status(200).json({
      message: "Milestone deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting milestone:", error);

    res.status(500).json({
      message: "Error deleting milestone",
    });
  }
};

export const updateMilestoneVisibility = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { isPublic } = req.body;

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    if (typeof isPublic !== "boolean") {
      res.status(400).json({
        message: "isPublic must be a boolean",
      });
      return;
    }

    const milestone = await Milestone.findOneAndUpdate(
      {
        _id: req.params.id,
        userId,
      },
      {
        isPublic,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!milestone) {
      res.status(404).json({
        message:
          "Milestone not found or you do not have permission",
      });
      return;
    }

    io.emit("milestoneUpdated", milestone);

    res.status(200).json({
      message: isPublic
        ? "Milestone is now public"
        : "Milestone is now private",
      milestone,
    });
  } catch (error) {
    console.error(
      "Error updating milestone visibility:",
      error
    );

    res.status(500).json({
      message: "Error updating milestone visibility",
    });
  }
};

export const getPublicMilestoneById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const milestone = await Milestone.findOne({
      _id: req.params.id,
      isPublic: true,
    }).populate("userId", "name email");

    if (!milestone) {
      res.status(404).json({
        message:
          "Public milestone not found or this milestone is private",
      });
      return;
    }

    res.status(200).json(milestone);
  } catch (error) {
    console.error(
      "Error getting public milestone:",
      error
    );

    res.status(500).json({
      message: "Error getting public milestone",
    });
  }
};