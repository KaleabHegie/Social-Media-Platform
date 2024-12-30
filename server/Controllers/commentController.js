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
   * To Delete a Post  - DELETE /api/deletePost
   *
   *
   *
   *
   ************************************************************************/
  deletePost: async (req, res) => {
    try {
      // Check if the user is logged in
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Can't Delete posts if user is not logged in",
        });
      }

      const { postId } = req.query;

      // Check if the post exists
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(constants.NOT_FOUND).json({
          message: "Post not found",
        });
      }

      // Check if the logged-in user is the author of the post
      if (post.user.toString() !== req.user.id) {
        return res.status(constants.FORBIDDEN).json({
          message: "You are not authorized to delete this post",
        });
      }

      // Delete the post
      await Post.findByIdAndDelete(postId);

      // Update the user's post count
      const user = await User.findById(req.user.id);

      if (user) {
        user.post_count = user.post_count > 0 ? user.post_count - 1 : 0; // Decrease the post count, ensuring it doesn't go negative
        await user.save();
      }

      res.json({
        message: "Post deleted successfully",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      res
        .status(constants.SERVER_ERROR)
        .json({ error: "An error occurred while creating the post" });
    }
  },

  /************************************************************************
   *
   *
   *
   * To Get HashTags  - GET /api/getHashTags
   *
   *
   *
   *
   ************************************************************************/
  getHashTags: async (req, res) => {
    try {
      const hashtags = await Hashtag.find({});
      res.status(200).json({ hashtags });
    } catch (error) {
      console.error("Error fetching hashtags:", error);
      res
        .status(constants.SERVER_ERROR)
        .json({ message: "An error occurred while fetching hashtags" });
    }
  },
};

module.exports = commentController;
