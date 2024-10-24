// IMPORT REQUIRED PACKAGES
import express from "express";
import dotenv from "dotenv";
import userRoute from "./src/routes/authRoute.js";
import dbConnection from "./src/db/db.js";
import handleError from "./src/middleware/error.middleware.js";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import postRoute from "./src/routes/postRoute.js";
import profileRoute from "./src/routes/profileRoute.js";
import commentRoute from "./src/routes/commentRoute.js";
import likeRoute from "./src/routes/likeRoute.js";
import searchRoute from "./src/routes/searchRoute.js";

// SETUP EXPRESS
const app = express();
app.use(express.json());

// ENV CONFIG
dotenv.config({
  path: "./.env",
});

// COOKIE SETUP
app.use(cookieParser());

// ERROR HANDLE
app.use(handleError);

// CREATING LIMIT FOR REQUEST SENT
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 5, // 5 request per minutes
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// DEFINE ROUTES ENDPOINT
app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/profile", profileRoute);
app.use("/comment", commentRoute);
app.use("/like_dislike", likeRoute);
app.use("/search", searchRoute);

// DATABASE CONNECTION
dbConnection();

// LISTEN APP
app.listen(3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 5000}`);
});
