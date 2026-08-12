import mongoose, { Schema } from "mongoose";
const MilestoneSchema = new Schema({
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
    isPublic: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
export default mongoose.model("Milestone", MilestoneSchema);
