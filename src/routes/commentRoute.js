import express from "express";
const commentRoute = express.Router();
import isLoggedIn from "../helpers/checkLogged.js";
import { createComment, getComment , deleteComment } from "../controllers/commentController.js";

// CREATE COMMENT AND GET ALL COMMENT REGARDING POST !!!

commentRoute.route("/create/:postId").put(isLoggedIn,createComment);
commentRoute.route("/getComment/:id").put(isLoggedIn,getComment);

// DELETE THE SPECIFIED COMMENT 
commentRoute.route("/delete/:id").delete(isLoggedIn,deleteComment)

export default commentRoute;