import mongoose from "mongoose";
import handleError from "../middleware/error.middleware.js";
import { User } from "../models/user.model.js";

export const followUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({
        status: false,
        message: "You can't follow yourself",
      });
    }

    const user = await User.findById(id);
    const meUser = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    if (user.followers.includes(req.user.id)) {
      return res.status(400).json({
        status: false,
        message: "User already followed",
      });
    }

    user.followers.push(req.user.id);

    if (!meUser.following.includes(id)) {
      meUser.following.push(id);
    }

    await user.save();
    await meUser.save();

    return res.status(200).json({
      status: true,
      message: "User followed successfully",
      user: id,
    });
  } catch (error) {
    return handleError(error, req, res);
  }
};

export const unFollowUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({
        status: false,
        message: "You can't unfollow yourself",
      });
    }

    const user = await User.findById(id);
    const meUser = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    if (!user.followers.includes(req.user.id)) {
      return res.status(400).json({
        status: false,
        message: "User not followed",
      });
    }

    const followerIndex = user.followers.indexOf(req.user.id);
    if (followerIndex > -1) {
      user.followers.splice(followerIndex, 1);
    }

    const followingIndex = meUser.following.indexOf(id);
    if (followingIndex > -1) {
      meUser.following.splice(followingIndex, 1);
    }

    await user.save();
    await meUser.save();

    return res.status(200).json({
      status: true,
      message: "User unfollowed successfully",
    });
  } catch (error) {
    return handleError(error, req, res);
  }
};

// TODO: MAKE AGGREGATION PERFECT
export const getFollowers = async (req, res) => {
  try {
    const id = req.user.id;
    // const user = await User.aggregate([
    //   {
    //     $match: {
    //       _id: new mongoose.Types.ObjectId(req.user.id),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "followers",
    //       foreignField: "_id",
    //       as: "followerData",
    //     },
    //   },
    //   {
    //     $project: {
    //       username: 1, // Include username field
    //       profilePic: 1, // Include profile picture
    //       bio: 1, // Include bio
    //       followerCount: { $size: "$followers" }, // Add field for follower count
    //       followerData: {
    //         // Include follower details (optional)
    //         $slice: ["$followerData", 0, 10], // Limit retrieved followers to 10
    //       },
    //     },
    //   },
    //   {
    //     $addFields: {
    //       followerData: {
    //         $first: "$followers",
    //       },
    //     },
    //   },
    // ]);

    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "posts",
          foreignField: "user",
          as: "postData",
        },
      },
      {
        $project: {
          post: 1,
        },
      },
    ]);
    return res.json({
      status: true,
      message: "User followed successfully",
      user: user,
    });
  } catch (error) {
    return handleError(error, req, res);
  }
};
