import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import handleError from "../middleware/error.middleware.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../helpers/cloudinary.js";

// POST CREATE AND GET !!!

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const postImage = req.file;
    const userId = req.user.id;
    if (!content) {
      return res.status(400).json({ message: "Please enter a post content" });
    }

    const userData = await User.findById(userId);

    const uploadPostImage = await uploadOnCloudinary(postImage.path, "PostPic");
    if (!uploadPostImage) {
      return res.status(500).json({
        status: false,
        message: "Error uploading image",
      });
    }

    const post = new Post({
      user: userId,
      content,
      content_pic: uploadPostImage.url || "",
    });
    if (!post) {
      return res.status(500).json({
        status: false,
        message: "Post not created",
      });
    }
    const data = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          post: post._id,
        },
      },
      {
        new: true,
      }
    );
    if (!data) {
      return res.status(500).json({
        status: false,
        message: "User not found",
      });
    }
    await post.save();

    return res.status(200).json({
      status: true,
      message: "Post Created !!!",
      post: post,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      status: false,
      message: "Error creating post",
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const data = [];
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $project: {
          content: 1,
          "userData.username": 1,
          content_pic: 1,
        },
      },
    ]);
    if (!posts) {
      return res.status(500).json({
        status: false,
        message: "Post not found",
      });
    }
    return res.status(200).json({
      status: true,
      post: posts,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      status: false,
      message: "Error fetching post",
    });
  }
};

export const userSpecifiedPost = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({
        status: false,
        message: "User ID is required",
      });
    }
    // const post = await Post.find({ user: id });
    const post = await Post.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $project: {
          _id: 0,
          content: 1,
        },
      },
    ]);
    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
      });
    }
    return res.status(200).json({
      status: true,
      post: post,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      status: false,
      message: "Error fetching post",
    });
  }
};

// EDIT POST

export const editPost = async (req, res) => {
  try {
    const id = req.params.postId;
    if (!id) {
      return res.status(404).json({
        status: false,
        message: "Post ID is required",
      });
    }
    const data = await Post.findById(id);

    const { content } = req.body;

    if (!content) {
      return res.status(404).json({
        status: false,
        message: "Can't Update !!!",
      });
    }

    if (content === data.content) {
      return res.status(400).json({
        status: false,
        message: "Matched !!",
      });
    }
    const postData = await Post.findByIdAndUpdate(
      id,
      {
        $set: {
          content: content,
        },
      },
      {
        new: true,
      }
    );
    if (!postData) {
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
    return res.status(400).json({
      status: false,
      message: "Error editing post",
    });
  }
};

// DELETE POST

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Find the post by ID and ensure it belongs to the user
    const post = await Post.findOne({ _id: postId, user: userId });
    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post not found or not authorized",
      });
    }

    // Remove the post
    await Post.deleteOne({ _id: postId });

    // Update the user's post list
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          post: postId,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      status: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      status: false,
      message: "Error deleting post",
    });
  }
};
