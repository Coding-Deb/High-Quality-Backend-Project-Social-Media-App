import express from "express";
import {
  login,
  logout,
  register,
  // checkLoggedUser,
} from "../controllers/userController.js";
import isLoggedIn from '../helpers/checkLogged.js'
import jwt from "jsonwebtoken";
import { followUser, getFollowers, unFollowUser } from "../controllers/followController.js";
import { upload } from "../middleware/multer.middleware.js";
// import verifyJWT from "../middleware/verifyToken.js";
const userRoute = express.Router();


// User Create And login 
userRoute.route("/register").post(upload.single("profilePic"),register);
userRoute.route("/login").post(login);

// User logged Out
userRoute.route("/logout").get(logout);

// User Follow And Unfollow 
userRoute.route("/follow/:id").put(isLoggedIn, followUser);

userRoute.route("/unfollow/:id").delete(isLoggedIn,unFollowUser);


// todo: make aggregation perfect
// Get Followers And Followings

userRoute.route("/followers").get(isLoggedIn, getFollowers);

export default userRoute;
