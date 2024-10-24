import express from "express";
const searchRoute = express.Router();

import { searchData } from "../controllers/searchController.js";
import isLoggedIn from "../helpers/checkLogged.js";

// GET ALL USERS ACCORDING TO SEARCH QUERY
searchRoute.route("/:query").get(isLoggedIn, searchData);

export default searchRoute;