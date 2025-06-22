import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv"

dotenv.config()

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        // File has been uploaded successfully
        console.log("File uploaded to Cloudinary:", response.url);
        
        // Remove the locally saved temporary file
        fs.unlinkSync(localFilePath);
        
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        
        // Remove the locally saved temporary file as the upload operation failed
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        return null;
    }
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;
        
        const response = await cloudinary.uploader.destroy(publicId);
        console.log("File deleted from Cloudinary:", response);
        
        return response;
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };