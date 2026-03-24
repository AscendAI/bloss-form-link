import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getCloudinaryVideos() {
  try {
    const { resources } = await cloudinary.api.resources({
      resource_type: 'video',
      max_results: 10,
    });
    return resources;
  } catch (error) {
    console.error('Error fetching videos from Cloudinary:', error);
    return [];
  }
}
