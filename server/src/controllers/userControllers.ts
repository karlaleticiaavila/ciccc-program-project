
import { Request, Response } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const createAccessToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      userId,
    },
    jwtSecret,
    {
      expiresIn: "14d",
    }
  );
};
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

export const syncGoogleUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { googleId, name, email, profilePicture } = req.body;

    if (!googleId || !name || !email) {
      res.status(400).json({
        message: "googleId, name and email are required",
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({
      $or: [{ googleId }, { email: normalizedEmail }],
    });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
      }

      if (profilePicture) {
        user.profilePicture = profilePicture;
      }

      await user.save();

      const accessToken = createAccessToken(
        user._id.toString()
      );

      res.status(200).json({
        message: "User already exists",
        user,
        accessToken,
      });

      return;
    }

    user = await User.create({
      googleId,
      name,
      email: normalizedEmail,
      profilePicture: profilePicture ?? "",
      role: "user",
    });

    const accessToken = createAccessToken(
      user._id.toString()
    );

    res.status(201).json({
      message: "User created successfully",
      user,
      accessToken,
    });
  } catch (error) {
    console.error("Error syncing Google user:", error);

    res.status(500).json({
      message: "Error syncing Google user",
    });
  }
};

export const syncAppleUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { appleId, name, email } = req.body;

    if (!appleId) {
      res.status(400).json({
        message: "appleId is required",
      });
      return;
    }

    const normalizedEmail = email
      ? email.toLowerCase().trim()
      : undefined;

    let user = await User.findOne({
      appleId,
    });

    if (!user && normalizedEmail) {
      user = await User.findOne({
        email: normalizedEmail,
      });

      if (user && !user.appleId) {
        user.appleId = appleId;
        await user.save();
      }
    }

    if (!user) {
      if (!normalizedEmail) {
        res.status(400).json({
          message:
            "Email is required for the first Apple sign in",
        });
        return;
      }

      user = await User.create({
        appleId,
        name: name || "Apple User",
        email: normalizedEmail,
        role: "user",
        profilePicture: "",
      });
    }

    const accessToken = createAccessToken(
      user._id.toString()
    );

    res.status(200).json({
      message: "Apple user synced successfully",
      user,
      accessToken,
    });
  } catch (error) {
    console.error(
      "Error syncing Apple user:",
      error
    );

    res.status(500).json({
      message: "Error syncing Apple user",
    });
  }
};

export const registerWithEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        message: "Name, email and password are required",
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      res.status(409).json({
        message: "An account with this email already exists",
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role: "user",
      profilePicture: "",
    });

    const accessToken = createAccessToken(
      user._id.toString()
    );

    res.status(201).json({
      message: "Account created successfully",
      user,
      accessToken,
    });
  } catch (error) {
    console.error(
      "Error registering email user:",
      error
    );

    res.status(500).json({
      message: "Error creating account",
    });
  }
};

export const loginWithEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user || !user.passwordHash) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const accessToken = createAccessToken(
      user._id.toString()
    );

    res.status(200).json({
      message: "Login successful",
      user,
      accessToken,
    });
  } catch (error) {
    console.error("Error logging in with email:", error);

    res.status(500).json({
      message: "Error logging in",
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