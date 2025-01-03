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
      const { caption, rawHashtags, type } = req.body;

      if (!type) {
        return res.status(constants.VALIDATION_ERRORS).json({
          message: "Post type is required",
        });
      }

      // Validate raw hashtags string length
      if (rawHashtags && rawHashtags.length > 300) {
        return res.status(constants.VALIDATION_ERRORS).json({
          message: "Hashtags is too long (Max 300 letters)",
        });
      }

      let hashtags = [];

      // Parse hashtags from raw string
      if (rawHashtags) {
        hashtags = rawHashtags
          .split("#") // Split by "#"
          .map((tag) => tag.trim().replace(/\s+/g, "_")) // Trim and replace spaces within hashtags
          .filter((tag) => tag.length > 0); // Remove empty entries
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

  likePost: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "User must be logged in to like a post.",
        });
      }

      const { postId } = req.query; // Assuming postId is passed as a query parameter
      const userId = req.user.id; // Get the logged-in user's ID

      // Validate the required fields
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

      // Check if the user has already liked the post
      const likeIndex = post.likes.findIndex(
        (like) => like.userId && like.userId === userId.toString()
      );

      let isLiked;

      if (likeIndex === -1) {
        // User hasn't liked the post, so add the like
        post.likes.push({ userId: userId.toString() }); // Make sure userId is correctly stored
        isLiked = true;
        post.likes_count += 1; // Increment the likes count
      } else {
        // User has already liked the post, so remove the like
        post.likes.splice(likeIndex, 1);
        isLiked = false;
        post.likes_count -= 1; // Decrement the likes count
      }

      // Save the updated post
      await post.save();

      return res.json({
        message: isLiked ? "Post liked successfully" : "Post unliked successfully",
        isLiked,
        likesCount: post.likes_count, // Return the updated like count
      });
    } catch (error) {
      console.error("Error liking/unliking post:", error.toString());
      return res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while processing your request",
      });
    }
  },

  //@TODO Implement the hashtag algo, paginations and not showing private posts to non followers and randomized posts
  getHomeFeed: async (req, res) => {
    try {
      // Check if the user is logged in
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "User must be logged in to access the home feed",
        });
      }

      const userId = req.user.id;

      // Fetch posts with user details populated
      const posts = await Post.find({ type: "post" })
        .populate({
          path: "user",
          select: "user_name profile_photo_url _id", // Only fetch these fields from the user schema
        })
        .sort({ createdAt: -1 }) // Sort posts by creation date (newest first)
        .limit(20); // Limit to 20 posts (can be made dynamic via query params)

      return res.json({
        message: "Home feed fetched successfully",
        posts,
      });
    } catch (error) {
      console.error("Error fetching home feed:", error.toString());
      return res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while fetching the home feed",
      });
    }
  },

  //@TODO Implment u should only see stories of people you follow
  getStories: async (req, res) => {
    try {
      // Check if the user is logged in
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "User must be logged in to access stories",
        });
      }

      const userId = req.user.id;

      // Fetch posts of type "story" with user details populated
      const stories = await Post.find({ type: "story" })
        .populate({
          path: "user",
          select: "user_name profile_photo_url _id", // Fetch only these fields from the user schema
        })
        .sort({ createdAt: -1 }) // Sort stories by creation date (newest first)
        .limit(20); // Limit to 20 stories (can be made dynamic via query params)

      return res.json({
        message: "Stories fetched successfully",
        stories,
      });
    } catch (error) {
      console.error("Error fetching stories:", error.toString());
      return res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while fetching stories",
      });
    }
  },
  

  //@todo Implement the explore feed algo and Search Functionality By Hastag Matching, Pagination
  getExploreFeed: async (req, res) => {
    try {
      // Check if the user is logged in
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "User must be logged in to access the explore feed",
        });
      }

      // Fetch posts of type "post" with only the required fields
      const explorePosts = await Post.find({ type: "post" })
        .select("medias hashtags _id") // Select only the required fields
        .sort({ createdAt: -1 }) // Sort posts by creation date (newest first)
        .limit(20); // Limit to 20 posts (can be made dynamic via query params)

      return res.json({
        message: "Explore feed fetched successfully",
        posts: explorePosts,
      });
    } catch (error) {
      console.error("Error fetching explore feed:", error.toString());
      return res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while fetching the explore feed",
      });
    }
  },
};

module.exports = postController;
