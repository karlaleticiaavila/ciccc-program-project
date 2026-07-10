import { Request, Response } from "express";
import Milestone from "../models/Milestone.js";
import { io } from "../server.js";

export const createMilestone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, date, category, userId } = req.body;

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
    res.status(500).json({
      message: "Error creating milestone",
      error,
    });
  }
};

export const getMilestones = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const milestones = await Milestone.find().populate("userId");

    res.status(200).json(milestones);
  } catch (error) {
    res.status(500).json({
      message: "Error getting milestones",
      error,
    });
  }
};

export const getMilestoneById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      res.status(404).json({
        message: "Milestone not found",
      });
      return;
    }

    res.status(200).json(milestone);
  } catch (error) {
    res.status(500).json({
      message: "Error getting milestone",
      error,
    });
  }
};

export const updateMilestone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const milestone = await Milestone.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!milestone) {
      res.status(404).json({
        message: "Milestone not found",
      });
      return;
    }

    res.status(200).json({
      message: "Milestone updated successfully",
      milestone,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating milestone",
      error,
    });
  }
};

export const deleteMilestone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const milestone = await Milestone.findByIdAndDelete(req.params.id);

    if (!milestone) {
      res.status(404).json({
        message: "Milestone not found",
      });
      return;
    }

    res.status(200).json({
      message: "Milestone deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting milestone",
      error,
    });
  }
};