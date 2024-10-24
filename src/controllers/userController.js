import express from "express";
import jwt from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { User } from "../models/user.model.js";
import { registerSchema, loginSchema } from "../validation/validation.js";
import handleError from "../middleware/error.middleware.js";
import rateLimit from "express-rate-limit";
import { uploadOnCloudinary } from "../helpers/cloudinary.js";

// Token expiration and refresh
const accessTokenExpiration = 60 * 60; // 1 hour
const refreshTokenExpiration = 60 * 60 * 24 * 30; // 30 days

// USER CREATE !!!!!

export const register = async (req, res) => {
  try {
    // Validate request data using Joi schema
    const { username, email, password } = await registerSchema.parseAsync(
      req.body
    );


    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Username or email already exists",
      });
    }

    // Profile Picture upload
    const profilePicture = req.file;

    if (!profilePicture) {
      return res.status(400).json({
        status: false,
        message: "No file uploaded!",
      });
    }


    // Upload image to Cloudinary

    const image = await uploadOnCloudinary(profilePicture.path, username); // Upload image to cloudinary


    if (!image) {
      return res.status(400).json({
        status: false,
        message: "No file uploaded!",
      })
    }
    
    console.log("Successfully Uploaded !!!");
    

    // Hash the password
    const hashedPassword = await hash(password, 10);


    // Create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      profilePic: image.url || ""
    });

    await user.save();

    // return response for created user
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )

    // Generate JWT token
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
    };
    // Generate JWT tokens
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: accessTokenExpiration,
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: refreshTokenExpiration,
    });

    res.cookie("token", accessToken);

    // Store refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      status: true,
      message: "User created successfully",
      createdUser,
    });
  } catch (error) {
    handleError(error, req, res);
  }
};

// USER LOGGED !!!!

export const login = async (req, res) => {
  try {
    // Validate request data using Joi schema
    const { email, password } = await loginSchema.parseAsync(req.body);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User Can't Find || Register first Please",
      });
    }

    // Verify password
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        status: false,
        message: "Password Not Matched",
      });
    }

    // Generate JWT token
    const payload = { id: user._id };
    // Generate JWT tokens
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: accessTokenExpiration,
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: refreshTokenExpiration,
    });

    res.cookie("token", accessToken);

    // Update refresh token
    user.refreshToken = refreshToken;
    await user.save();

    const loggeduser = await User.findById(user._id).select(
      "-password -refreshToken "
    );

    res.status(200).json({
      status: true,
      message: "User Logged !!!!",
      accessToken,
      refreshToken,
      loggeduser,
    });
  } catch (error) {
    handleError(error, req, res);
  }
};

// USER LOGGED OUT !!!!!!

export const logout = async (req, res) => {
  res.cookie("token", "");
  return res.status(200).json({
    status: true,
    message: "User Logout !!!!",
  });
};
