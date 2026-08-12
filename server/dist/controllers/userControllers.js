import User from "../models/User.js";
import jwt from "jsonwebtoken";
const createAccessToken = (userId) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign({
        userId,
    }, jwtSecret, {
        expiresIn: "1h",
    });
};
export const createUser = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error,
        });
    }
};
export const syncGoogleUser = async (req, res) => {
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
            const accessToken = createAccessToken(user._id.toString());
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
        const accessToken = createAccessToken(user._id.toString());
        res.status(201).json({
            message: "User created successfully",
            user,
            accessToken,
        });
    }
    catch (error) {
        console.error("Error syncing Google user:", error);
        res.status(500).json({
            message: "Error syncing Google user",
        });
    }
};
export const getUsers = async (_req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({
            message: "Error getting users",
            error,
        });
    }
};
