import mongoose, { Schema, Document } from "mongoose";

export interface IEvidence extends Document {
  title: string;
  type: "image" | "certificate" | "link" | "github" | "video" | "document";
  url: string;
  description?: string;
  milestoneId: mongoose.Types.ObjectId;
}

const EvidenceSchema = new Schema<IEvidence>(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["image", "certificate", "link", "github", "video", "document"],
      required: true,
    },
    url: { type: String, required: true },
    description: { type: String, default: "" },
    milestoneId: {
      type: Schema.Types.ObjectId,
      ref: "Milestone",
      required: true,
    },
  },
  { timestamps: true }
);





export default mongoose.model<IEvidence>("Evidence", EvidenceSchema);