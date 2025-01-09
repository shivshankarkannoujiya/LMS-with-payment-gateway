import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({});

// Check and load env variables

cloudinary.config({
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    cloud_name: process.env.CLOUD_NAME,
});

export const uploadMedia = async (file) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(file, {
            resource_type: 'auto',
        });
        return uploadResponse;
    } catch (error) {
        console.error('Error in uploading media to cloudinary: ', error);
        console.log(error);
    }
};

export const deleteMediaFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log('Failed to delete MEDIA from Cloudinary');
        console.error(error);
    }
};

export const deleteVideoFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId, {
            resource_type: 'video',
        });
    } catch (error) {
        console.log('Failed to delete VIDEO from Cloudinary');
        console.error(error);
    }
};
