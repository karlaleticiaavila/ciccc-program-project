import mongoose, { Schema } from "mongoose";
const EvidenceSchema = new Schema({
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
}, {
    timestamps: true,
});
export default mongoose.model("Evidence", EvidenceSchema);
