import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  googleId?: string;
  appleId?: string;
  passwordHash?: string;
  name: string;
  email: string;
  role: "user" | "mentor" | "recruiter";
  bio?: string;
  profilePicture?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    appleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    passwordHash: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    role: {
      type: String,
      enum: ["user", "mentor", "recruiter"],
      default: "user",
    },

    bio: {
      type: String,
      default: "",
    },

    profilePicture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);