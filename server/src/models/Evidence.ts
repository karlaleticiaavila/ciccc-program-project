import mongoose, { Document, Schema } from "mongoose";

export type EvidenceType =
  | "image"
  | "certificate"
  | "link"
  | "github"
  | "video"
  | "document";

export interface IEvidence extends Document {
  title: string;
  type: EvidenceType;
  url: string;
  description?: string;
  milestoneId: mongoose.Types.ObjectId;

  // Cloudinary: solo existirán cuando la evidencia sea un archivo subido.
  publicId?: string;
  resourceType?: "image" | "video" | "raw";
  format?: string;
  originalFilename?: string;
  mimeType?: string;
  bytes?: number;

  createdAt: Date;
  updatedAt: Date;
}

const EvidenceSchema = new Schema<IEvidence>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "image",
        "certificate",
        "link",
        "github",
        "video",
        "document",
      ],
      required: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    milestoneId: {
      type: Schema.Types.ObjectId,
      ref: "Milestone",
      required: true,
      index: true,
    },

    publicId: {
      type: String,
      trim: true,
    },

    resourceType: {
      type: String,
      enum: ["image", "video", "raw"],
    },

    format: {
      type: String,
      trim: true,
    },

    originalFilename: {
      type: String,
      trim: true,
    },

    mimeType: {
      type: String,
      trim: true,
    },

    bytes: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEvidence>(
  "Evidence",
  EvidenceSchema
);