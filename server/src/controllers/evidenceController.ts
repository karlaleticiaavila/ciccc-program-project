import { Request, Response } from "express";
import Evidence from "../models/Evidence.js";

export const createEvidence = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, type, url, description, milestoneId } = req.body;

    const evidence = await Evidence.create({
      title,
      type,
      url,
      description,
      milestoneId,
    });

    res.status(201).json({
      message: "Evidence created successfully",
      evidence,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating evidence",
      error,
    });
  }
};

export const getEvidence = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const evidence = await Evidence.find().populate("milestoneId");

    res.status(200).json(evidence);
  } catch (error) {
    res.status(500).json({
      message: "Error getting evidence",
      error,
    });
  }
};


export const getEvidenceById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const evidence = await Evidence.findById(req.params.id);

    if (!evidence) {
      res.status(404).json({
        message: "Evidence not found",
      });
      return;
    }

    res.status(200).json(evidence);
  } catch (error) {
    res.status(500).json({
      message: "Error getting evidence",
      error,
    });
  }
};

export const updateEvidence = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const evidence = await Evidence.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!evidence) {
      res.status(404).json({
        message: "Evidence not found",
      });
      return;
    }

    res.status(200).json({
      message: "Evidence updated successfully",
      evidence,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating evidence",
      error,
    });
  }
};

export const deleteEvidence = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const evidence = await Evidence.findByIdAndDelete(req.params.id);

    if (!evidence) {
      res.status(404).json({
        message: "Evidence not found",
      });
      return;
    }

    res.status(200).json({
      message: "Evidence deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting evidence",
      error,
    });
  }
};