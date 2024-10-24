import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
const postRoute = express.Router();
import { createPost, deletePost, editPost, getAllPost, userSpecifiedPost,  } from "../controllers/postController.js";
import isLoggedIn from "../helpers/checkLogged.js";
import { upload } from "../middleware/multer.middleware.js";

// CREATE POST AND GET ALL AND SPECIFIED POST !!!
postRoute.route("/").post(isLoggedIn, upload.single("content_pic"),createPost);
postRoute.route("/getAllPost").get(isLoggedIn, getAllPost);
postRoute.route("/getPost/:id").put(isLoggedIn, userSpecifiedPost);

// EDIT POST 
postRoute.route("/editPost/:postId").put(isLoggedIn,editPost);

// DELETE POST
postRoute.route("/delete/:postId").delete(isLoggedIn,deletePost);

export default postRoute;
 