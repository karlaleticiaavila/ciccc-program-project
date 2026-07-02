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
    const evidence = await Evidence.find();

    res.status(200).json(evidence);
  } catch (error) {
    res.status(500).json({
      message: "Error getting evidence",
      error,
    });
  }
};
