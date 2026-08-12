import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
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
}, {
    timestamps: true,
});
export default mongoose.model("User", UserSchema);
