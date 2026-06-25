import { Request, Response } from "express";
import User from "../models/User.js";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, role, bio, profilePicture } = req.body;

    const newUser = await User.create({
      name,
      email,
      role,
      bio,
      profilePicture,
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error,
    });
  }
};

export const getUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error getting users",
      error,
    });
  }
};