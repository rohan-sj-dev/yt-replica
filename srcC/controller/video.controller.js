import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import mongoose, { isValidObjectId } from "mongoose";

// Get all videos with pagination and filters
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    
    const pipeline = [];
    
    // Match stage for filtering
    const matchStage = {
        isPublished: true
    };
    
    // Search by query in title or description
    if (query) {
        matchStage.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }
    
    // Filter by userId if provided
    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid userId");
        }
        matchStage.owner = new mongoose.Types.ObjectId(userId);
    }
    
    pipeline.push({ $match: matchStage });
    
    // Lookup stage to get owner details
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "ownerDetails",
            pipeline: [
                {
                    $project: {
                        username: 1,
                        avatar: 1
                    }
                }
            ]
        }
    });
    
    pipeline.push({
        $addFields: {
            ownerDetails: {
                $first: "$ownerDetails"
            }
        }
    });
    
    // Sort stage
    const sortStage = {};
    if (sortBy && sortType) {
        sortStage[sortBy] = sortType === "desc" ? -1 : 1;
    } else {
        sortStage.createdAt = -1; // Default sort by newest
    }
    pipeline.push({ $sort: sortStage });
    
    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(limit) });
    
    const videos = await Video.aggregate(pipeline);
    const totalVideos = await Video.countDocuments(matchStage);
    
    return res.status(200).json(
        new ApiResponse(200, {
            videos,
            totalVideos,
            totalPages: Math.ceil(totalVideos / limit),
            currentPage: parseInt(page)
        }, "Videos fetched successfully")
    );
});

// Upload a video
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    
    // Validation
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }
    
    // Check for video file and thumbnail
    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    
    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required");
    }
    
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required");
    }
    
    // Upload to cloudinary
    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    
    if (!videoFile) {
        throw new ApiError(400, "Video file upload failed");
    }
    
    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail upload failed");
    }
    
    // Create video document
    const video = await Video.create({
        title,
        description,
        duration: videoFile.duration || 0,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        owner: req.user?._id,
        isPublished: false
    });
    
    const videoUploaded = await Video.findById(video._id);
    
    if (!videoUploaded) {
        throw new ApiError(500, "Video upload failed please try again");
    }
    
    return res.status(201).json(
        new ApiResponse(201, video, "Video uploaded successfully")
    );
});

// Get video by id
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }
    
    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            fullName: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $project: {
                videoFile: 1,
                title: 1,
                description: 1,
                views: 1,
                createdAt: 1,
                duration: 1,
                owner: 1,
                thumbnail: 1,
                isPublished: 1
            }
        }
    ]);
    
    if (!video?.length) {
        throw new ApiError(404, "Video does not exist");
    }
    
    // Increment views if user is watching
    await Video.findByIdAndUpdate(videoId, {
        $inc: {
            views: 1
        }
    });
    
    // Add to watch history if user is logged in
    if (req.user?._id) {
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: {
                watchHistory: videoId
            }
        });
    }
    
    return res.status(200).json(
        new ApiResponse(200, video[0], "Video details fetched successfully")
    );
});

// Update video details
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }
    
    if (!(title && description)) {
        throw new ApiError(400, "Title and description are required");
    }
    
    const video = await Video.findById(videoId);
    
    if (!video) {
        throw new ApiError(404, "No video found");
    }
    
    if (video?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You can't edit this video as you are not the owner");
    }
    
    // Handle thumbnail update if provided
    let thumbnailUrl = video.thumbnail;
    const thumbnailLocalPath = req.file?.path;
    
    if (thumbnailLocalPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        
        if (!thumbnail) {
            throw new ApiError(400, "Thumbnail upload failed");
        }
        
        thumbnailUrl = thumbnail.url;
    }
    
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail: thumbnailUrl
            }
        },
        { new: true }
    );
    
    if (!updatedVideo) {
        throw new ApiError(500, "Failed to update video please try again");
    }
    
    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    );
});

// Delete video
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }
    
    const video = await Video.findById(videoId);
    
    if (!video) {
        throw new ApiError(404, "No video found");
    }
    
    if (video?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You can't delete this video as you are not the owner");
    }
    
    const videoDeleted = await Video.findByIdAndDelete(video?._id);
    
    if (!videoDeleted) {
        throw new ApiError(400, "Failed to delete the video please try again");
    }
    
    // Delete files from cloudinary (optional - implement if you have public_id stored)
    // await deleteFromCloudinary(video.thumbnail);
    // await deleteFromCloudinary(video.videoFile);
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    );
});

// Toggle publish status
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }
    
    const video = await Video.findById(videoId);
    
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    
    if (video?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You can't toggle publish status as you are not the owner");
    }
    
    const toggledVideoPublish = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !video?.isPublished
            }
        },
        { new: true }
    );
    
    return res.status(200).json(
        new ApiResponse(
            200,
            { isPublished: toggledVideoPublish.isPublished },
            "Video publish status toggled successfully"
        )
    );
});

// Get user's videos
const getUserVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    
    const pipeline = [
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: (parseInt(page) - 1) * parseInt(limit)
        },
        {
            $limit: parseInt(limit)
        }
    ];
    
    const videos = await Video.aggregate(pipeline);
    const totalVideos = await Video.countDocuments({ owner: req.user._id });
    
    return res.status(200).json(
        new ApiResponse(200, {
            videos,
            totalVideos,
            totalPages: Math.ceil(totalVideos / limit),
            currentPage: parseInt(page)
        }, "User videos fetched successfully")
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getUserVideos
};
