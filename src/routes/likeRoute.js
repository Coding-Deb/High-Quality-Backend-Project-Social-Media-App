import express from "express";
import isLoggedIn from "../helpers/checkLogged.js";
const likeRoute = express.Router();

import { createLike, deleteLike } from "../controllers/likeController.js";

// GIVE LIKE TO POST OR COMMENT !!!
likeRoute.route("/like/:id").put(isLoggedIn, createLike);

// DISLIKE POST OR COMMENT !!!
likeRoute.route("/like/delete/:id").delete(isLoggedIn,deleteLike);



export default likeRoute;
