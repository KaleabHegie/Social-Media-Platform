const cloudinary = require("cloudinary").v2;
const { constants } = require("../Utils/constants");
const User = require("../Models/UserModel");
const Post = require("../Models/PostModel");
const Hashtag = require("../Models/HashTagModel");

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dwkvbn1vu",
  api_key: "922675774229729",
  api_secret: "zfWlXCOgJU0q4p3yVHZEEo74PnY",
});

const postController = {
  /************************************************************************
   *
   *
   *
   * To Upload Post  - POST /api/uploadPost
   *
   *
   *
   *
   ************************************************************************/
  uploadPost: async (req, res) => {
    try {
      // Check if the user is logged in
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Can't upload posts if user is not logged in",
        });
      }

      const { caption, hashtags, type } = req.body;

      if (!type) {
        return res.status(constants.VALIDATION_ERRORS).json({
          message: "Post type is required",
        });
      }

      if (hashtags && hashtags.length > 5) {
        return res.status(constants.VALIDATION_ERRORS).json({
          message: "Too Many HashTags",
        });
      }

      const files = req.files;

      const uploadedMediaUrls = [];

      // Upload files to Cloudinary
      for (const file of files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder: type === "post" ? "posts" : "stories" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          stream.end(file.buffer);
        });

        uploadedMediaUrls.push(result.secure_url);
      }

      // Find the user by ID
      const user = await User.findById(req.user.id);

      // Check if the user exists
      if (!user) {
        return res.status(constants.UNAUTHORIZED).json({ error: "User not found" });
      }

      // Create a new post and associate it with the user
      const newPost = new Post({
        user: user._id,
        medias: uploadedMediaUrls,
        caption,
        hashtags,
        type,
      });

      // Save the post
      await newPost.save();

      // Optionally, update the user's post count
      user.post_count++;
      await user.save();

      res.status(200).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
      console.error("Error creating post:", error.toString());
      res
        .status(constants.SERVER_ERROR)
        .json({ error: "An error occurred while creating the post" });
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

module.exports = postController;
