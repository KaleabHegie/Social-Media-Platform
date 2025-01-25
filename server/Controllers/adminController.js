const { constants } = require("../Utils/constants");
const User = require("../Models/UserModel");
const Comment = require("../Models/CommentModel");
const ReportedPost = require("../Models/ReportModel");
const Post = require("../Models/PostModel");
const { ObjectId } = require("mongoose").Types; 
const adminController = {
  deleteAccountAdmin: async (req, res) => {
    try {
      if (!req.user || !req.user.is_admin) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Not Authorized",
        });
      }

      // Get the userId from the query string
      const userIdToDelete = req.query.userId;

      // Validate if userId is provided
      if (!userIdToDelete) {
        return res.status(400).json({ message: "User ID is required in the query" });
      }

      if (userIdToDelete == req.user.id) {
        return res.status(constants.VALIDATION_ERRORS).json({
          message: "Can't Delete Admin Account",
        });
      }

      // Find and delete the user by userId
      const deletedUser = await User.findByIdAndDelete(userIdToDelete);

      // Check if user exists
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      //Delete Related Posts
      await Post.deleteMany({ user: userIdToDelete });

      await Comment.deleteMany({ sender: userIdToDelete });

      await ReportedPost.deleteMany({
        "postId.user": userIdToDelete,
      });

      // Send success message
      res.json({
        message: "User Account Deletedd successfully",
      });
    } catch (error) {
      console.error("Error deleting User Account:", error);
      res.status(500).json({
        message: "An error occurred while deleting User Account",
      });
    }
  },
  markAsVerifiedAdmin: async (req, res) => {
    try {
      if (!req.user || !req.user.is_admin) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Not Authorized",
        });
      }

      // Get the userId from the query string
      const userId = req.query.userId;

      // Validate if userId is provided
      if (!userId) {
        return res.status(400).json({ message: "User ID is required in the query" });
      }

      // Find the user to get the current verification status
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Toggle the verification status
      const newStatus = !user.is_verified;

      // Update the user's verification status
      user.is_verified = newStatus;
      await user.save();

      res.json({
        message: `User verification Updated To: ${newStatus ? "verified" : "unverified"}`,
        newStatus: newStatus,
      });
    } catch (error) {
      console.error("Error toggling user verification:", error);
      res.status(500).json({
        message: "An error occurred while toggling user verification",
      });
    }
  },

  getReportedPosts: async (req, res) => {
    try {
      if (!req.user || !req.user.is_admin) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Not Authorized",
        });
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
      return res.json({ posts: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  getPostAnalytics: async (req, res) => {
    try {
      if (!req.user || !req.user.is_admin) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Not Authorized",
        });
      }

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
      console.log({ analytics: result });

      // Return the analytics data
      return res.json({ analytics: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  deleteReportedPost: async (req, res) => {
    try {
      if (!req.user || !req.user.is_admin) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Not Authorized",
        });
      }
      const reportedPostId = req.body.postId;
      // Check if postId is missing or invalid
      if (
        reportedPostId === undefined ||
        reportedPostId === null ||
        reportedPostId === "" ||
        !ObjectId.isValid(reportedPostId) // Validate if it's a valid ObjectId
      ) {
        return res.status(400).json({ message: "PostId required and must be valid" });
      }

      let deletedPost;
      // Find and delete the Repoted Post by PostID
      reportedPost = await ReportedPost.findOne({ postId: reportedPostId });
      if (reportedPost) {
        deletedPost = await ReportedPost.findByIdAndDelete(reportedPost._id);
        // Check if user exists
        if (!deletedPost) {
          return res.status(400).json({ message: "Reported Post not found" });
        }
      } else {
        return res.status(400).json({ message: "Reported Post not found" });
      }

      //Delete Related Posts
      await Post.findByIdAndDelete(reportedPostId);

      await Comment.deleteMany({ postId: reportedPostId });

      const user = await User.findById(deletedPost._id);

      if (user) {
        user.post_count = user.post_count > 0 ? user.post_count - 1 : 0; // Decrease the post count, ensuring it doesn't go negative
        await user.save();
      }

      // Send the success response
      return res.json({
        message: "Reported post Removed successfully.",
      });
    } catch (error) {
      console.error(error + "22222222222");
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
};

module.exports = adminController;
