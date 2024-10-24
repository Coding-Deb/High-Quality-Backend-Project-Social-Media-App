import multer from "multer";
import express from "express";
const profileRoute = express.Router();
import {
  profile,
  updateProfile,
  getProfile,
  updateProfilePic,
  deleteProfilePic,
} from "../controllers/profileControllers.js";
import isLoggedIn from "../helpers/checkLogged.js";
import { upload } from "../middleware/multer.middleware.js";

// const upload = multer({ dest: "../uploads/" });

// Get And Update Profile
profileRoute.route("/").get(isLoggedIn, profile);
profileRoute.route("/updateProfile").get(isLoggedIn, updateProfile);
profileRoute
  .route("/profileImage")
  .post(isLoggedIn, upload.single("profilePic"), updateProfilePic);

  profileRoute.route("/deletePic").delete(isLoggedIn,deleteProfilePic)

profileRoute.route("/getData/:id").get(isLoggedIn, getProfile);

export default profileRoute;
