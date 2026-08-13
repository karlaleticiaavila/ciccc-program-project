import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
  milestoneId: mongoose.Types.ObjectId;
  mentorId: mongoose.Types.ObjectId;
  message: string;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    milestoneId: {
      type: Schema.Types.ObjectId,
      ref: "Milestone",
      required: true,
    },

    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFeedback>(
  "Feedback",
  FeedbackSchema
);