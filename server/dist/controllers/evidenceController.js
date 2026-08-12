import { Readable } from "stream";
import Evidence from "../models/Evidence.js";
import cloudinary from "../config/cloudinary.js";
export const createEvidence = async (req, res) => {
    try {
        const { title, type, url, description, milestoneId } = req.body;
        let finalUrl = url;
        let publicId;
        let resourceType;
        let format;
        let originalFilename;
        let bytes;
        let mimeType;
        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                    folder: "who-are-you-becoming/evidence",
                    resource_type: "auto",
                }, (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(result);
                });
                Readable.from(req.file.buffer).pipe(uploadStream);
            });
            finalUrl = uploadResult.secure_url;
            publicId = uploadResult.public_id;
            resourceType = uploadResult.resource_type;
            format = uploadResult.format;
            originalFilename =
                uploadResult.original_filename || req.file.originalname;
            bytes = uploadResult.bytes;
            mimeType = req.file.mimetype;
        }
        if (!finalUrl) {
            res.status(400).json({
                message: "Evidence requires either a URL or a file",
            });
            return;
        }
        const evidence = await Evidence.create({
            title,
            type,
            url: finalUrl,
            description,
            milestoneId,
            publicId,
            resourceType,
            format,
            originalFilename,
            bytes,
            mimeType,
        });
        res.status(201).json({
            message: "Evidence created successfully",
            evidence,
        });
    }
    catch (error) {
        console.error("Error creating evidence:", error);
        res.status(500).json({
            message: "Error creating evidence",
            error,
        });
    }
};
export const getEvidence = async (_req, res) => {
    try {
        const evidence = await Evidence.find().populate("milestoneId");
        res.status(200).json(evidence);
    }
    catch (error) {
        res.status(500).json({
            message: "Error getting evidence",
            error,
        });
    }
};
export const getEvidenceById = async (req, res) => {
    try {
        const evidence = await Evidence.findById(req.params.id);
        if (!evidence) {
            res.status(404).json({
                message: "Evidence not found",
            });
            return;
        }
        res.status(200).json(evidence);
    }
    catch (error) {
        res.status(500).json({
            message: "Error getting evidence",
            error,
        });
    }
};
export const updateEvidence = async (req, res) => {
    try {
        const evidence = await Evidence.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!evidence) {
            res.status(404).json({
                message: "Evidence not found",
            });
            return;
        }
        res.status(200).json({
            message: "Evidence updated successfully",
            evidence,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error updating evidence",
            error,
        });
    }
};
export const deleteEvidence = async (req, res) => {
    try {
        const evidence = await Evidence.findById(req.params.id);
        if (!evidence) {
            res.status(404).json({
                message: "Evidence not found",
            });
            return;
        }
        if (evidence.publicId && evidence.resourceType) {
            await cloudinary.uploader.destroy(evidence.publicId, {
                resource_type: evidence.resourceType,
            });
        }
        await Evidence.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Evidence deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting evidence:", error);
        res.status(500).json({
            message: "Error deleting evidence",
            error,
        });
    }
};
export const getEvidenceByMilestone = async (req, res) => {
    try {
        const evidence = await Evidence.find({
            milestoneId: req.params.milestoneId,
        });
        res.status(200).json(evidence);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching evidence by milestone",
            error,
        });
    }
};
