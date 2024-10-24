import { request } from "express";
import {
  destroyCloudinaryImage,
  uploadOnCloudinary,
} from "../helpers/cloudinary.js";
import handleError from "../middleware/error.middleware.js";
import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,

  // cloud_name: "dbbjsrztd",
  // api_key: "674264321174389",
  // api_secret: "RQywawzV7jktaQZIV9W3bRVBcPY",
});

// USER GET PROFILE

export const profile = async (req, res) => {
  try {
    const id = req.user.id;
    const userData = await User.findById(id);
    // console.log(id);
    // console.log(userData.username);

    return res.status(200).json({
      status: true,
      user: userData,
    });
  } catch (error) {
    return res.status(404).json({
      status: false,
      message: "User Not Found",
    });
  }
};

// USER UPDATE PROFILE

export const updateProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const { username, email, bio } = req.body;
    if (!username || !email || !bio) {
      return res.status(200).json({
        status: false,
        message: "Field Required !!!",
      });
    }

    const userData = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          username: username,
          email: email,
          bio: bio,
          // profilePic: imageurl,
        },
      },
      {
        new: true,
      }
    );
    if (!userData) {
      return res.status(400).json({
        status: false,
        message: "Can't Update !!!",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Successfully Updated !!!",
    });
  } catch (error) {
    console.log(error);

    return handleError(error, req, res);
  }
};

// UPDATE PROFILE

export const getProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const userdata = await User.findById(id);
    if (!userdata) {
      return res.status(404).json({
        status: false,
        message: "User Can't Find",
      });
    }
     res.status(200).json({
      status: true,
      message: "User Profile Found",
      userdata,
    });
    return userdata;
  } catch (error) {
    return handleError(error, req, res);
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const id = req.user.id;

    const userdata = await User.findById(id);

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "No file uploaded!",
      });
    }

    const image = await uploadOnCloudinary(req.file.path, userdata.username);
    // console.log(image.url);

    if (image) {
      await User.findByIdAndUpdate(id, {
        $set: {
          profilePic: image.url || "",
        },
      });

      res.status(200).json({
        status: true,
        message: "Successfully Uploaded !!!",
      });
    }
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return handleError(error, req, res);
  }
};

export const deleteProfilePic = async (req, res) => {
  try {
    const id = req.user.id;
    const userData = await User.findById(id);
    const publicId = userData.profilePic.split("/").slice(-1)[0].split(".")[0];

    const response = await destroyCloudinaryImage(userData.username, publicId);

    if (response) {
      await User.findByIdAndUpdate(id, {
        $set:{
          profilePic : 1
        }
      });

      res.status(200).json({
        status: true,
        message: "Successfully Deleted !!!",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Something went wrong",
    });
  }
};
