import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import handleError from "../middleware/error.middleware.js";
import mongoose from "mongoose";

// CREATE COMMENT FOR USER POST !!!
export const createComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const { comment } = req.body;
    if (!userId || !postId) {
      return res.status(400).json({
        status: true,
        message: "User ID and Post ID are required",
      });
    }
    if (!comment) {
      return res.status(400).json({
        status: false,
        message: "Comment is required",
      });
    }
    console.log(
      `UserId = ${userId}  && postId = ${postId}  && Comment = ${comment}`
    );

    const postComment = new Comment({
      user: userId,
      post: postId,
      comment,
    });
    if (!postComment) {
      return res.status(400).json({
        status: false,
        message: "Comment not created",
      });
    }
    const data = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: postComment._id },
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({
        status: false,
        message: "Data not found !!!",
      });
    }
    console.log(data);

    await postComment.save();
    return res.status(200).json({
      status: true,
      message: "Comment created successfully",
    });
  } catch (error) {
    console.log(error);
    // return handleError(error, req, res);
    return res.status(400).json({
      status: false,
      message: "Error while creating comment",
    });
  }
};

// GET ALL COMMENT
export const getComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const data = [];
    // await Post.findById(postId)
    //   .populate("comments")
    //   .then((document) => {
    //     document.comments.forEach((item) => {
    //       return data.push(item.comment);
    //     });
    //   });
    const allCommentsForSpecificPost = await Post.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(postId),
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },
      {
        $unwind: "$comments",
      },
      {
        $project: {
          _id: 0,
          comment: "$comments.comment",
        },
      },
    ]);
    res.status(200).json({
      status: true,
      data: allCommentsForSpecificPost,
    });
  } catch (error) {
    return handleError(error, req, res);
  }
};

// DELETE ANY COMMENNT !!!

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    if (!commentId) {
      return res.status(400).json({
        status: false,
        message: "Comment ID is required",
      });
    }

    // Find the comment to ensure it exists and belongs to the user
    const comment = await Comment.findById(commentId);
    console.log(comment);

    if (!comment) {
      return res.status(404).json({
        status: false,
        message: "Comment not found",
      });
    }

    // Check if the comment belongs to the user
    if (comment.user.toString() !== userId) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized to delete this comment",
      });
    }

    // Delete the comment
    // await Comment.findByIdAndDelete(commentId);
    await Comment.findById({ _id: commentId }, { user: 1 }); // Projection for security

    // Remove the comment reference from the post
    await Post.findByIdAndUpdate(
      comment.post,
      {
        $pull: { comments: commentId },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      status: true,
      message: "Successfully deleted",
    });
  } catch (error) {
    return handleError(error, req, res);
  }
};
