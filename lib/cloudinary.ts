import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getCloudinaryVideos(folderName?: string) {
  try {
    const options: any = {
      resource_type: 'video',
      max_results: 50,
    };
    if (folderName) {
      options.type = 'upload';
      options.prefix = folderName.endsWith('/') ? folderName : `${folderName}/`;
    }
    const { resources } = await cloudinary.api.resources(options);
    return resources;
  } catch (error) {
    console.error('Error fetching videos from Cloudinary:', error);
    return [];
  }
}

export async function getCloudinaryImages(folderName?: string) {
  try {
    const options: any = {
      resource_type: 'image',
      max_results: 50,
    };
    if (folderName) {
      options.type = 'upload';
      options.prefix = folderName.endsWith('/') ? folderName : `${folderName}/`;
    }
    const { resources } = await cloudinary.api.resources(options);
    return resources;
  } catch (error) {
    console.error('Error fetching images from Cloudinary:', error);
    return [];
  }
}

