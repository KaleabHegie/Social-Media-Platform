const { constants } = require("../Utils/constants");
const User = require("../Models/UserModel");
const ReportedPost = require("../Models/ReportModel");
const Post = require("../Models/PostModel");
const Hashtag = require("../Models/HashTagModel");

const adminController = {
  deleteAccountAdmin: async (req, res) => {
    try {
      const adminUserId = req.user.id; // Assuming `req.user.id` is set by some authentication middleware

      // @todo: Check if the user is an admin here

      // Get the userId from the query string
      const userIdToDelete = req.query.userId;

      // Validate if userId is provided
      if (!userIdToDelete) {
        return res.status(400).json({ message: "User ID is required in the query" });
      }

      // Find and delete the user by userId
      const deletedUser = await User.findByIdAndDelete(userIdToDelete);

      // Check if user exists
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Send success message
      res.json({
        message: "User Account Deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting User Account:", error);
      res.status(500).json({
        error: "An error occurred while deleting User Account",
      });
    }
  },
  getReportedPosts: async (req, res) => {
    try {
      const userId = req.user.id; // Assuming `req.user.id` is set by some authentication middleware

      // @todo: Check if the user is an admin here

      if (!userId) {
        return res.status(404).json({ message: "Need to be Logged In" });
      }

      // Fetch all reported posts
      const reportedPosts = await ReportedPost.find()
        .populate({
          path: "postId",
          select: "caption medias likes_count comments_count", // Specify the fields you want from Post
        })
        .exec();

      if (!reportedPosts) {
        return res.status(404).json({ message: "No reported posts found" });
      }

      // Filter and populate users only if their userId exists in the User collection
      const result = await Promise.all(
        reportedPosts.map(async (reportedPost) => {
          const post = reportedPost.postId;
          const users = await Promise.all(
            reportedPost.users
              .filter(async (report) => {
                // Check if the userId exists in the User collection
                const user = await User.findById(report.userId);
                return user !== null; // Only include the user if they exist
              })
              .map(async (report) => {
                const user = await User.findById(report.userId); // Fetch the user by ID
                return user
                  ? {
                      _id: user._id,
                      user_name: user.user_name,
                      first_name: user.first_name,
                      last_name: user.last_name,
                      profile_photo_url: user.profile_photo_url,
                      reason: report.reason,
                    }
                  : null;
              })
          );

          // Return the post and the filtered list of users who reported it
          return {
            post,
            reportedBy: users.filter((user) => user !== null), // Remove null values (non-existing users)
          };
        })
      );

      // Send the response
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  getPostAnalytics: async (req, res) => {
    try {
      const today = new Date();
      const tenDaysAgo = new Date(today);
      tenDaysAgo.setDate(today.getDate() - 10); // Get the date 10 days ago

      // Query for posts and stories created in the last 10 days
      const posts = await Post.find({
        createdAt: { $gte: tenDaysAgo }, // Filter posts created in the last 10 days
      });

      // Group posts and stories by date
      const analytics = {};

      posts.forEach((post) => {
        const postDate = post.createdAt.toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format

        // Initialize the day if it doesn't exist in the analytics object
        if (!analytics[postDate]) {
          analytics[postDate] = { posts: 0, stories: 0 };
        }

        // Increment post count or story count based on type
        if (post.type === "post") {
          analytics[postDate].posts += 1;
        } else if (post.type === "story") {
          analytics[postDate].stories += 1;
        }
      });

      // Convert the analytics object to an array for easier consumption
      const result = Object.keys(analytics).map((date) => ({
        date,
        posts: analytics[date].posts,
        stories: analytics[date].stories,
      }));

      // Return the analytics data
      return res.json({ analytics: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  
  deleteReportedPost: async (req, res) => {
    try {
      const userId = req.user.id; // Assuming `req.user.id` is set by some authentication middleware

      // @todo: Check if the user is an admin here
      if (!userId) {
        return res
          .status(403)
          .json({ message: "You need admin privileges to delete posts." });
      }

      const postId = req.query.postId;
      const reportedPostId = postId;

      // Fetch the reported post to ensure it exists
      const reportedPost = await ReportedPost.findById(reportedPostId);
      if (!reportedPost) {
        return res.status(404).json({ message: "Reported post not found." });
      }

      // Fetch the post to ensure it exists
      const post = await Post.findById(reportedPostId);
      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }

      // Delete the post from both collections
      await Post.deleteOne({ _id: reportedPostId });
      await ReportedPost.deleteOne({ _id: reportedPostId });

      // Send the success response
      return res.json({
        message: "Reported post and t post have been deleted successfully.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  getUserDataAdmin: async (req, res) => {
    try {
      const userId = req.user.id; // Assuming `req.user.id` is set by some authentication middleware

      // @todo: Check if the user is an admin here

      if (!userId) {
        return res.status(404).json({ message: "Need to be Logged In" });
      }

      // Get the search query from the query string (optional)
      const searchQuery = req.query.query || ""; // Default to empty string if no search query is provided

      // Build the search filter
      const filter = searchQuery
        ? { user_name: { $regex: searchQuery, $options: "i" } } // Case-insensitive search
        : {};

      // Fetch users with the search filter and exclude sensitive fields
      const users = await User.find(filter).select(
        "-password -notifications -resetToken -tokenExpiry -followers -following"
      );

      // Send back the users data
      return res.json({
        users,
      });
    } catch (error) {
      console.error("Error fetching user data:", error.toString());
      return res.status(500).json({
        message: "An error occurred while fetching user data",
      });
    }
  },

  uploadHashTagAdmin: async (req, res) => {
    try {
      // Check if the user is logged in
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Can't upload HashTags if user is not logged in",
        });
      }

      let { hashtag } = req.body;

      // Check if hashtag is provided
      if (!hashtag) {
        return res.status(constants.VALIDATION_ERRORS).json({
          message: "Hashtag is required",
        });
      }

      // Check if the hashtag already exists
      const existingHashtag = await Hashtag.findOne({ name: hashtag });

      if (existingHashtag) {
        return res.status(constants.VALIDATION_ERRORS).json({
          message: "Hashtag already exists",
          hashtag: existingHashtag,
        });
      }

      hashtag = hashtag.trim().toLowerCase();

      // Create a new hashtag if it doesn't exist
      const newHashtag = new Hashtag({ name: hashtag });
      await newHashtag.save();

      // Return success response
      res.json({
        message: "Hashtag created successfully",
        hashtag: newHashtag,
      });
    } catch (error) {
      console.error("Error uploading hashtag:", error);
      res
        .status(constants.SERVER_ERROR)
        .json({ error: "An error occurred while uploading the hashtag" });
    }
  },
};

module.exports = adminController;
