import handleError from "../middleware/error.middleware.js";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { Like } from "../models/like.model.js";
import mongoose from "mongoose";

export const createLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    let postId;
    let commentId;

    const post = await Post.findById(id);
    const comment = await Comment.findById(id);

    if (post) {
      postId = id;
    } else if (comment) {
      commentId = id;
    } else {
      return res.status(400).json({
        status: false,
        message: "No Data Found !!!",
      });
    }

    // Create a new Like instance
    const like = new Like({
      user: userId,
      post: postId,
      comment: commentId,
    });

    // Save the Like instance to the database
    await like.save();

    // TODO: ADD PUSH METHOD FOR COMMENT AND POST
    if (postId) {
      await Post.findByIdAndUpdate(
        postId,
        {
          $push: {
            likes: like._id,
          },
        },
        {
          new: true,
        }
      );
    } else if (commentId) {
      await Comment.findByIdAndUpdate(
        commentId,
        {
          $push: {
            likes: like._id,
          },
        },
        {
          new: true,
        }
      );
    } else {
      return res.status(400).json({
        status: false,
        message: "No Data Found !!!",
      });
    }

    return res.status(201).json({
      status: true,
      message: "Like added successfully!",
      like: like,
    });
  } catch (error) {
    console.log(error);
    return handleError(error, req, res);
  }
};

export const deleteLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    let postId;
    let commentId;

    const post = await Post.findById(id);
    const comment = await Comment.findById(id);

    if (post) {
      postId = id;
    } else if (comment) {
      commentId = id;
    } else {
      return res.status(400).json({
        status: false,
        message: "No Data Found !!!",
      });
    }
    const like = await Like.findOne({
      user: userId,
      post: postId,
      comment: commentId
    })
    if (postId) {
      await Post.findByIdAndUpdate(
        postId,
        {
          $pull: {
            likes: like._id,
          },
        },
        {
          new: true,
        }
      );
    } else if (commentId) {
      await Comment.findByIdAndUpdate(
        commentId,
        {
          $pull: {
            likes: like._id,
          },
        },
        {
          new: true,
        }
      );
    } else {
      return res.status(400).json({
        status: false,
        message: "No Data Found !!!",
      });
    }
    if (!like) {
      return res.status(400).json({
        status: false,
        message: "Not Found !!!",
      });
    }
    await Like.findByIdAndDelete(like._id);
    return res.status(200).json({
      status: true,
      message: "Like deleted successfully!",
    });
  } catch (error) {
    return handleError(error, req, res);
  }
};
