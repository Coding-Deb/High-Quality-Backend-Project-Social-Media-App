import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,

  // cloud_name: "dbbjsrztd",
  // api_key: "674264321174389",
  // api_secret: "RQywawzV7jktaQZIV9W3bRVBcPY",
});

// Upload image to Cloudinary
const uploadOnCloudinary = async (localFilePath, folder) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folder,
    });

    console.log("File uploaded to Cloudinary:", response.url);
    fs.unlinkSync(localFilePath); // Remove local file

    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    fs.unlinkSync(localFilePath); // Remove local file

    return null;
  }
  // console.log({
  //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  //   api_key: process.env.CLOUDINARY_API_KEY,
  //   api_secret: process.env.CLOUDINARY_API_SECRET,
  // });
};

const destroyCloudinaryImage = async (folder, publicId) => {
  try {
    if (!publicId || !folder) return null;
    const response = await cloudinary.uploader.destroy(`${folder}/${publicId}`);
    console.log("Image deleted from Cloudinary:", response.result);
    return response;
  } catch (error) {
    console.log("Error deleting image from Cloudinary:", error);
    
    return null;
  }
};

export { uploadOnCloudinary, destroyCloudinaryImage };
