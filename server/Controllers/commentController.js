const cloudinary = require("cloudinary").v2;
const { constants } = require("../Utils/constants");
const User = require("../Models/UserModel");
const Comment = require("../Models/commentModel");
const Post = require("../Models/PostModel");

const commentController = {
  /************************************************************************
   *
   *
   *
   * To Make a Comment  - POST /api/makeComment
   *
   *
   *
   *
   ************************************************************************/
  makeComment: async (req, res) => {
    try {
      // Check if the user is logged in
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "User must be logged in to make a comment.",
        });
      }

      const { postId, content, parentId } = req.body;

      // Validate the required fields
      if (!postId || !content) {
        return res.status(constants.VALIDATION_ERRORS).json({
          message: "Post ID and content are required.",
        });
      }

      // Check if the post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(constants.NOT_FOUND).json({ message: "Post not found." });
      }

      // Check if the parent comment exists (optional)
      let parentComment = null;
      if (parentId) {
        parentComment = await Comment.findById(parentId);
        if (!parentComment) {
          return res
            .status(constants.NOT_FOUND)
            .json({ message: "Parent comment not found." });
        }
      }

      // Create the new comment
      const newComment = new Comment({
        postId,
        sender: req.user.id,
        content,
        parent: parentComment ? parentComment._id : null, // Directly reference parent comment ID
      });

      // Save the new comment
      await newComment.save();

      // Increment comment count only after saving the comment
      post.comments_count += 1;
      await post.save();

      return res.json({ message: "Comment created successfully.", comment: newComment });
    } catch (error) {
      console.error("Error making comment:", error.toString());
      return res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while creating the comment.",
      });
    }
  },

  /************************************************************************
   *
   *
   *
   * To Delete a Comment  - DELETE /api/deleteComment
   *
   *
   *
   *
   ************************************************************************/
  deleteComment: async (req, res) => {
    try {
      // Ensure the user is logged in
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "User must be logged in to delete a comment.",
        });
      }

      const { commentId } = req.body;

      // Validate the comment ID
      if (!commentId) {
        return res.status(constants.VALIDATION_ERRORS).json({
          message: "Comment ID is required.",
        });
      }

      // Find the comment to delete
      const commentToDelete = await Comment.findById(commentId);

      if (!commentToDelete) {
        return res.status(constants.NOT_FOUND).json({ message: "Comment not found." });
      }

      // Check if the logged-in user is the sender of the comment
      if (commentToDelete.sender.toString() !== req.user.id.toString()) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Only the author of the comment can delete it.",
        });
      }

      const postId = commentToDelete.postId;

      // Delete replies to the comment
      await Comment.deleteMany({ parent: commentToDelete._id });

      // Delete the comment itself
      await commentToDelete.remove();

      // Update the post's comments count
      if (postId) {
        const newCount = await Comment.countDocuments({ postId });
        await Post.findByIdAndUpdate(postId, { comments_count: newCount });
      }

      return res.json({ message: "Comment and replies deleted successfully." });
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while deleting the comment.",
      });
    }
  },

  /************************************************************************
   *
   *
   *
   * To Get Comments  - GET /api/getComments?postId=postId
   *
   *
   *
   *
   ************************************************************************/
  getComments: async (req, res) => {
    try {
      const { postId } = req.query; // Assuming postId is passed as a query parameter

      if (!postId) {
        return res.status(constants.VALIDATION_ERRORS).json({
          message: "Post ID is required",
        });
      }

      // Find the post by ID
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(constants.NOT_FOUND).json({ message: "Post not found" });
      }

      // Find all comments related to this post (either direct comments or replies)
      const comments = await Comment.find({ postId: postId }).sort({ createdAt: -1 }); // Sorting by creation time (or change it to likes_count if needed)

      // Separate outer comments and replies
      const outerComments = [];
      const repliesMap = new Map();

      comments.forEach((comment) => {
        if (!comment.parent) {
          // This is an outer comment
          outerComments.push({
            ...comment.toObject(),
            replies: [], // Initialize replies as an empty array
          });
        } else {
          // This is a reply
          if (!repliesMap.has(comment.parent.toString())) {
            repliesMap.set(comment.parent.toString(), []);
          }
          repliesMap.get(comment.parent.toString()).push(comment);
        }
      });

      // Sort function by like count
      const sortByLikes = (a, b) => b.likes.length - a.likes.length;

      // Sort outer comments by like count
      outerComments.sort(sortByLikes);

      // Attach sorted replies to their respective outer comments
      outerComments.forEach((comment) => {
        const replies = repliesMap.get(comment._id.toString()) || [];
        comment.replies = replies.sort(sortByLikes);
      });

      return res.json({
        postId: postId,
        comments: outerComments,
      });
    } catch (error) {
      console.error("Error getting comments:", error.toString());
      return res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while fetching the comments",
      });
    }
  },

  /************************************************************************
   *
   *
   *
   * To Like Comments  - POST /api/likeComment?commentId=commentId
   *
   *
   *
   *
   ************************************************************************/
  likeComment: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "User must be logged in to Like a comment.",
        });
      }

      const { commentId } = req.query; // Assuming commentId is passed as a query parameter
      const userId = req.user.id; // Get the logged-in user's ID

      // Validate the required fields
      if (!commentId) {
        return res.status(constants.VALIDATION_ERRORS).json({
          message: "Comment ID is required",
        });
      }

      // Find the comment by ID
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(constants.NOT_FOUND).json({ message: "Comment not found" });
      }

      // Check if the user has already liked the comment
      const likeIndex = comment.likes.findIndex(
        (like) => like.userId && like.userId === userId.toString()
      );

      let isLiked;

      if (likeIndex === -1) {
        // User hasn't liked the comment, so add the like
        comment.likes.push({ userId: userId.toString() }); // Make sure userId is correctly stored
        isLiked = true;
      } else {
        // User has already liked the comment, so remove the like
        comment.likes.splice(likeIndex, 1);
        isLiked = false;
      }

      // Save the updated comment
      await comment.save();

      return res.json({
        message: isLiked ? "Comment liked successfully" : "Comment unliked successfully",
        isLiked,
        likesCount: comment.likes.length,
      });
    } catch (error) {
      console.error("Error liking/unliking comment:", error.toString());
      return res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while processing your request",
      });
    }
  },
};

module.exports = commentController;
