import mongoose, { Schema, Document } from "mongoose";

export interface IMilestone extends Document {
  title: string;
  description: string;
  date: Date;
  category: string;
  userId: mongoose.Types.ObjectId;
}

const MilestoneSchema = new Schema<IMilestone>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMilestone>(
  "Milestone",
  MilestoneSchema
);
