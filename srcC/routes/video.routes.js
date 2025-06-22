import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    getUserVideos
} from "../controller/video.controller.js";
import { verifyJWT, optionalAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

// Public routes with optional authentication
router.route("/").get(optionalAuth, getAllVideos);
router.route("/:videoId").get(optionalAuth, getVideoById);

// Protected routes - require authentication
router.use(verifyJWT); // Apply verifyJWT middleware to all routes below

router
    .route("/upload")
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
        ]),
        publishAVideo
    );

router
    .route("/u/:videoId")
    .patch(upload.single("thumbnail"), updateVideo)
    .delete(deleteVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
router.route("/user/videos").get(getUserVideos);

export default router;
