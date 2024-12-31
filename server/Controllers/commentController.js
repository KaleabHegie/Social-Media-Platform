const cloudinary = require("cloudinary").v2;
const { constants } = require("../Utils/constants");
const User = require("../Models/UserModel");
const Post = require("../Models/PostModel");
const Hashtag = require("../Models/HashTagModel");

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
          message: "Can't make comments if the user is not logged in",
        });
      }

      const { postId, content, parentId } = req.body;

      // Validate the required fields
      if (!postId || !content) {
        return res.status(constants.VALIDATION_ERRORS).json({
          message: "Post ID and content are required",
        });
      }

      // Check if the post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(constants.NOT_FOUND).json({ message: "Post not found" });
      }

      // Check if the parent comment exists, if provided
      let parentComment = null;
      if (parentId) {
        parentComment = await Post.findOne(
          { "comments._id": parentId },
          { "comments.$": 1 }
        );
        if (!parentComment || !parentComment.comments.length) {
          return res
            .status(constants.NOT_FOUND)
            .json({ message: "Parent comment not found" });
        }
      }

      // Create the new comment
      const newComment = {
        sender: req.user.id,
        content,
        parent: parentComment ? parentComment.comments[0]._id : null,
        created_at: new Date(),
      };

      // Add the new comment to the post's comments array
      post.comments.push(newComment);
      post.comments_count += 1; // Increment comment count

      await post.save();

      return res.json({ message: "Comment created successfully", comment: newComment });
    } catch (error) {
      console.error("Error making comment:", error.toString());
      res
        .status(constants.SERVER_ERROR)
        .json({ message: "An error occurred while creating the comment" });
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
      // Check if the user is logged in
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Can't delete comments if the user is not logged in",
        });
      }

      const { commentId } = req.body;

      // Validate the required field
      if (!commentId) {
        return res.status(constants.VALIDATION_ERRORS).json({
          message: "Comment ID is required",
        });
      }

      // Find the post that contains the comment
      const post = await Post.findOne({ "comments._id": commentId });
      if (!post) {
        return res.status(constants.NOT_FOUND).json({ message: "Comment not found" });
      }

      // Find the comment within the post's comments array
      const comment = post.comments.find(
        (comment) => comment._id.toString() === commentId
      );

      if (!comment) {
        return res.status(constants.NOT_FOUND).json({ message: "Comment not found" });
      }

      // Check if the logged-in user is the sender of the comment
      if (comment.sender.toString() !== req.user.id) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Only Authors of the Comment Can Delete the Comment",
        });
      }

      // Delete all child comments (those with parentId as the deleted comment's _id)
      const deletedCommentParentId = comment._id;

      // Find all child comments (comments whose parent is the deleted comment)
      const childComments = post.comments.filter(
        (c) => c.parent && c.parent.toString() === deletedCommentParentId.toString()
      );

      // Remove the comment and its child comments from the post's comments array
      post.comments = post.comments.filter(
        (comment) => comment._id.toString() !== deletedCommentParentId.toString()
      );

      // Remove child comments as well
      post.comments = post.comments.filter(
        (comment) =>
          !childComments.some((child) => child._id.toString() === comment._id.toString())
      );

      // Update comments_count: decrement by 1 for each deleted comment (including child comments)
      post.comments_count -= 1 + childComments.length;

      // Save the post after deletion
      await post.save();

      return res.json({ message: "Comment and Comment Replies Deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error.toString());
      res
        .status(constants.SERVER_ERROR)
        .json({ message: "An error occurred while deleting the comment" });
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
      const { postId } = req.query; // Assuming postId is passed as a URL parameter

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

      // Separate outer comments and replies
      const outerComments = [];
      const repliesMap = new Map();

      post.comments.forEach((comment) => {
        if (!comment.parent) {
          // This is an outer comment
          outerComments.push({
            ...comment.toObject(),
            replies: [],
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
      const sortByLikes = (a, b) => b.like.length - a.like.length;

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
      res.status(constants.SERVER_ERROR).json({
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
      const { commentId } = req.query;
      const userId = req.user._id;

      // Find the post containing the comment
      const post = await Post.findOne({ "comments._id": commentId });

      if (!post) {
        return res.status(constants.NOT_FOUND).json({
          message: "Comment not found",
        });
      }

      // Find the comment in the post's comments array
      const comment = post.comments.id(commentId);

      if (!comment) {
        return res.status(constants.NOT_FOUND).json({
          message: "Comment not found",
        });
      }

      // Check if the user has already liked the comment
      const likeIndex = comment.likes.findIndex(
        (like) => like.user.toString() === userId.toString()
      );

      let isLiked;

      if (likeIndex === -1) {
        // User hasn't liked the comment, so add the like
        comment.likes.push({
          user: userId,
        });
        isLiked = true;
      } else {
        // User has already liked the comment, so remove the like
        comment.likes.splice(likeIndex, 1);
        isLiked = false;
      }

      // Save the updated post
      await post.save();

      return res.json({
        message: isLiked ? "Comment liked successfully" : "Comment unliked successfully",
        isLiked: isLiked,
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
