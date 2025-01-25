const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;
const { constants } = require("../Utils/constants");
const crypto = require("crypto");
const Post = require("../Models/PostModel");
const Message = require("../Models/MessageModel");
const User = require("../Models/UserModel");
const Comment = require("../Models/CommentModel");
const ReportedPost = require("../Models/ReportModel");

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dwkvbn1vu",
  api_key: "922675774229729",
  api_secret: "zfWlXCOgJU0q4p3yVHZEEo74PnY",
});

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "benjiyg400@gmail.com", // Your email
    pass: "fafwygqthjwmzscv", // Your email password
  },
});

const userController = {
  register: async (req, res) => {
    try {
      const { first_name, last_name, user_name, date_of_birth, email, gender, password } =
        req.body;

      // Validate required fields
      if (!first_name || !last_name || !user_name || !email || !password) {
        return res.status(400).json({
          message:
            "All required fields (first_name, last_name, user_name, email, password) must be provided.",
        });
      }

      // Validate gender if provided
      if (gender && !["male", "female"].includes(gender.toLowerCase())) {
        return res.status(400).json({
          message: "Invalid gender. Allowed values are 'male' or 'female'.",
        });
      }

      const existingUser = await User.findOne({
        $or: [{ email }, { user_name }],
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "A user was found with this email or username" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        first_name,
        last_name,
        user_name,
        date_of_birth,
        email,
        gender,
        password: hashedPassword,
      });

      res.json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      res
        .status(constants.SERVER_ERROR)
        .json({ message: "Error registering user", error });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Please provide a username/email and password" });
      }

      // Find user by either username or email
      const user = await User.findOne({
        $or: [{ user_name: username }, { email: username }],
      });

      if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
          {
            user: {
              username: user.user_name,
              email: user.email,
              id: user._id,
              is_admin: user.is_admin,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30d" }
        );
        return res.status(200).json({ accessToken, is_admin: user.is_admin });
      } else {
        return res.status(401).json({ message: "Invalid username/email or password" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ message: "An internal server error occurred" });
    }
  },

  createGroup: async (req, res) => {
    try {
      const { name, participants } = req.body;

      const creator = req.user;

      creator.is_group_admin = true;

      participants.push(creator);
      // Validation: Check if name and participants are provided
      if (!name || !participants || participants.length < 1) {
        return res
          .status(400)
          .json({ error: "Group name and participants are required." });
      }

      // Ensure at least one participant is a group admin
      const hasAdmin = participants.some((participant) => participant.is_group_admin);
      if (!hasAdmin) {
        return res.status(400).json({
          error: "At least one participant must be marked as a group admin.",
        });
      }

      // Validate each participant's userId
      let participants_id = []; // Initialize an empty array to store participant data

      const validParticipants = await Promise.all(
        participants.map(async (participant) => {
          // Push each participant's data into the array
          participants_id.push({
            userId: participant._id || participant.id,
            is_group_admin: participant.is_group_admin ? true : false,
          });
        })
      );

      // Now participants_id will be an array of participant objects

      if (validParticipants.includes(false)) {
        return res.status(404).json({ error: "One or more participants do not exist." });
      }

      // Create the group
      const group = new Message({
        name,
        is_group: true,
        participants: participants_id,
      });

      const savedGroup = await group.save();

      res.status(201).json({
        message: "Group created successfully.",
        group: savedGroup,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  },

  checkUsername: async (req, res) => {
    try {
      const { user_name } = req.body;
      const user = await User.findOne({ user_name });

      // Return a JSON object with 'isUnique' property
      return res.status(200).json({ isUnique: !user }); // true if no user found, false if user exists
    } catch (error) {
      console.error("Error checking username:", error);
      return res.status(500).json({ isUnique: false }); // Assume not unique if there's an error
    }
  },

  checkEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      return res.status(200).json({ isUnique: !user });
    } catch (error) {
      console.error("Error checking email:", error);
      return res.status(500).json(false);
    }
  },

  getAllUsers: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Can't fetch users if the user is not logged in",
        });
      }

      const currentUserId = req.user.id; // Assuming the user's ID is available as `_id`
      const user = await User.find({ _id: { $ne: currentUserId } }); // Exclude the current user

      if (!user || user.length === 0) {
        return res.status(constants.NOT_FOUND).json({
          message: "No users found",
        });
      }

      res.json({
        message: "Users fetched successfully",
        allUsers: user,
      });
    } catch (error) {
      console.error("Error fetching users:", error.toString());
      res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while fetching users",
      });
    }
  },

  getAllUsersChattedWith: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Can't fetch users if the user is not logged in",
        });
      }

      const currentUserId = req.user.id;

      // Find all messages where the current user is a participant
      const messages = await Message.find({
        "participants.userId": currentUserId,
        is_group: false,
      });

      // Extract unique participant IDs and details
      const userDetailsMap = new Map();
      messages.forEach((message) => {
        message.participants.forEach((participant) => {
          if (participant.userId.toString() !== currentUserId) {
            const otherUserId = participant.userId.toString();
            const lastOpenedAt = participant.last_opened_at;

            // Compute last message, recent messages, and unread count
            const sortedMessages = message.messages
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const lastMessage = sortedMessages[0] || null;
            const recentMessages = sortedMessages.slice(0, 5);

            const unreadCount = sortedMessages.filter(
              (msg) =>
                msg.sender.toString() !== currentUserId &&
                new Date(msg.createdAt) > new Date(lastOpenedAt)
            ).length;

            // Update the map with details
            if (
              !userDetailsMap.has(otherUserId) ||
              (lastMessage &&
                lastMessage.createdAt >
                  userDetailsMap.get(otherUserId).lastMessage?.createdAt)
            ) {
              userDetailsMap.set(otherUserId, {
                lastMessage,
                recentMessages,
                unreadCount,
                lastOpenedAt, // Include lastOpenedAt here
              });
            }
          }
        });
      });

      if (userDetailsMap.size === 0) {
        return res.status(constants.NOT_FOUND).json({
          message: "No users found",
        });
      }

      // Fetch user details with only the required fields
      const users = await User.find(
        { _id: { $in: Array.from(userDetailsMap.keys()) } },
        "_id user_name first_name last_name profile_photo_url"
      );

      // Attach last messages, recent messages, unread count, and lastOpenedAt to users
      const usersWithExtras = users.map((user) => {
        const details = userDetailsMap.get(user._id.toString());
        return {
          ...user.toObject(),
          lastMessage: details.lastMessage
            ? {
                content: details.lastMessage.content,
                sender: details.lastMessage.sender,
                media: details.lastMessage.media || null,
                createdAt: details.lastMessage.createdAt,
                user_name: user.user_name, // Include user_name of the sender
                isSentByCurrentUser:
                  details.lastMessage.sender.toString() === currentUserId, // Boolean flag if sent by current user
              }
            : null,
          recentMessages: details.recentMessages.map((msg) => ({
            content: msg.content,
            sender: msg.sender,
            media: msg.media || null,
            createdAt: msg.createdAt,
            user_name: user.user_name, // Include user_name of the sender
            isSentByCurrentUser: msg.sender.toString() === currentUserId, // Boolean flag if sent by current user
          })),
          unreadCount: details.unreadCount,
          lastOpenedAt: details.lastOpenedAt, // Include lastOpenedAt here
        };
      });

      res.json({
        message: "Users fetched successfully",
        allUsers: usersWithExtras,
      });
    } catch (error) {
      console.error("Error fetching users:", error.toString());
      res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while fetching users",
      });
    }
  },

  getChats: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Can't fetch users if the user is not logged in",
        });
      }

      const currentUserId = req.user.id; // Assuming the user's ID is available
      const chats = await Message.find({
        is_group: false,
      });

      const finalChats = chats.filter((chat) =>
        chat.participants.some(
          (participant) => participant.userId.toString() === currentUserId.toString()
        )
      );
      if (!finalChats || finalChats.length === 0) {
        return res.status(constants.NOT_FOUND).json({
          message: "No chats found",
        });
      }
      

      res.json({
        message: "Users fetched successfully",
        allUsers: finalChats,
      });
    } catch (error) {
      console.error("Error fetching users:", error.toString());
      res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while fetching users",
      });
    }
  },

  getGroups: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Can't fetch users if the user is not logged in",
        });
      }

      const currentUserId = req.user.id; // Assuming the user's ID is available
      const chats = await Message.find({ is_group: true });

      const groupChats = chats.filter((chat) =>
        chat.participants.some(
          (participant) => participant.userId.toString() === currentUserId.toString()
        )
      );
      if (!groupChats || groupChats.length === 0) {
        return res.status(constants.NOT_FOUND).json({
          message: "No chats found",
        });
      }

      res.json({
        message: "Users fetched successfully",
        allGroups: groupChats,
      });
    } catch (error) {
      console.error("Error fetching users:", error.toString());
      res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while fetching users",
      });
    }
  },

  setProfileImage: async (req, res) => {
    try {
      // Check if the user is logged in
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Can't set profile image if user is not logged in",
        });
      }

      // Check if the profile image is provided in the request
      if (!req.file) {
        console.log("Here");
        return res.status(constants.VALIDATION_ERRORS).json({
          message: "Profile image is required",
        });
      }

      // Find the user by ID
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "User not found",
        });
      }

      // Upload profile image to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "profilePics" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        // Use file.buffer to pass the file data
        stream.end(req.file.buffer);
      });

      // Get the URL of the uploaded image
      const profileImageUrl = result.secure_url;

      // Update the profile photo URL in the user's record
      user.profile_photo_url = profileImageUrl;
      await user.save();

      // Respond with the updated user information
      res.json({
        message: "Profile image updated successfully",
        profile_photo_url: user.profile_photo_url,
      });
    } catch (error) {
      console.error("Error setting profile image:", error.toString());
      res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while setting the profile image",
      });
    }
  },

  setBio: async (req, res) => {
    try {
      // Check if the user is logged in
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Can't set Bio if user is not logged in",
        });
      }
      let newBio = req.body.bio;
      if (!newBio) {
        return res.status(constants.VALIDATION_ERRORS).json({
          message: "Bio is required",
        });
      }

      newBio = newBio.trim().slice(0, 50);

      // Find the user by ID
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "User not found",
        });
      }

      user.bio = newBio;
      await user.save();

      // Respond with the updated user information
      res.json({
        message: "Profile Bio updated successfully",
        bio: user.bio,
      });
    } catch (error) {
      console.error("Error setting profile Bio:", error.toString());
      res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while setting the Bio",
      });
    }
  },

  setAccountVisibility: async (req, res) => {
    try {
      // Check if the user is logged in
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Can't set Account Visibility if user is not logged in",
        });
      }

      // Find the user by ID
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "User not found",
        });
      }

      // Toggle the is_private field
      user.is_private = !user.is_private;
      await user.save();

      res.json({
        message: `Account visibility updated successfully. Your account is now ${
          user.is_private ? "private" : "public"
        }.`,
        is_private: user.is_private,
      });
    } catch (error) {
      console.error("Error setting Account Visibility:", error.toString());
      res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while setting Account Visibility",
      });
    }
  },

  dismissNotifications: async (req, res) => {
    try {
      // Check if the user is logged in
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "You must be logged in to dismiss notifications.",
        });
      }

      // Find the user by ID
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(constants.NOT_FOUND).json({
          message: "User not found.",
        });
      }

      // Clear all notifications []
      user.notifications = [];
      await user.save();

      return res.json({
        message: "Notifications have been dismissed successfully.",
      });
    } catch (error) {
      console.error("Error dismissing notifications:", error.toString());
      return res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while dismissing notifications.",
      });
    }
  },
  getNotifications: async (req, res) => {
    try {
      // Check if the user is logged in
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "You must be logged in to view notifications.",
        });
      }

      // Find the user by ID and fetch notifications
      const user = await User.findById(req.user.id).select("notifications");

      if (!user) {
        return res.status(constants.NOT_FOUND).json({
          message: "User not found.",
        });
      }

      return res.json({
        message: "Notifications retrieved successfully.",
        notifications: user.notifications,
      });
    } catch (error) {
      console.error("Error retrieving notifications:", error.toString());
      return res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while retrieving notifications.",
      });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      // Check if the user is logged in
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Can't Delete Account if user is not logged in",
        });
      }

      // Delete the user's account
      const userIdToDelete = req.user.id;

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

      //Delete Related Posts
      await Post.deleteMany({ user: userIdToDelete });

      await Comment.deleteMany({ sender: userIdToDelete });

      await ReportedPost.deleteMany({
        "postId.user": userIdToDelete,
      });

      res.json({
        message: "User Account Deleted successfully",
      });
    } catch (error) {
      console.error("Error Deleteing User Account:", error);
      res.status(constants.SERVER_ERROR).json({
        error: "An error occurred while Deleteing User Account",
      });
    }
  },

  followUser: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Can't Follow User if user is not logged in",
        });
      }

      const userIdToFollow = req.body.userId; // User ID to follow/unfollow
      const currentUserId = req.user.id; // Logged-in user's ID

      // Check if the current user exists
      const currentUser = await User.findById(currentUserId);
      if (!currentUser) {
        return res.status(constants.NOT_FOUND).json({ message: "User not found" });
      }

      // Check if the user to follow exists
      const userToFollow = await User.findById(userIdToFollow);
      if (!userToFollow) {
        return res
          .status(constants.NOT_FOUND)
          .json({ message: "User to follow not found" });
      }

      // Check if the user is trying to follow themselves
      if (currentUserId.toString() === userIdToFollow.toString()) {
        return res
          .status(constants.VALIDATION_ERRORS)
          .json({ message: "You cannot follow yourself" });
      }

      // Check if the user is already following the user
      const isFollowing = currentUser.following.some(
        (follow) => follow.user.toString() === userIdToFollow.toString()
      );

      let actionMessage = "";
      let notificationContent = "";
      let userFollowed;

      if (isFollowing == false) {
        // Add user to following list

        if (userToFollow.is_private) {
          userToFollow.requests.push({ user: currentUserId });
          notificationContent = `${currentUser.user_name} requeseted to follow you.`;
          userToFollow.notifications.push({
            type: "requests",
            content: notificationContent,
          });
          await userToFollow.save();
          return res.json({ message: "Requested!" });
        }
        currentUser.following.push({ user: userIdToFollow });
        userToFollow.followers.push({ user: currentUserId });

        // Increment following and followers counts
        currentUser.following_count += 1;
        userToFollow.followers_count += 1;

        // Notification for the user who gained a follower
        notificationContent = `${currentUser.user_name} started following you.`;
        userToFollow.notifications.push({
          type: "follower",
          content: notificationContent,
        });

        actionMessage = "User followed successfully";
        userFollowed = true;
      } else {
        // Remove user from following list
        currentUser.following = currentUser.following.filter(
          (follow) => follow.user.toString() !== userIdToFollow.toString()
        );
        userToFollow.followers = userToFollow.followers.filter(
          (follower) => follower.user.toString() !== currentUserId.toString()
        );

        // Decrement following and followers counts
        currentUser.following_count =
          currentUser.following_count > 0 ? currentUser.following_count - 1 : 0;
        userToFollow.followers_count =
          userToFollow.followers_count > 0 ? userToFollow.followers_count - 1 : 0;

        // Notification for the user who lost a follower
        notificationContent = `${currentUser.user_name} unfollowed you.`;
        userToFollow.notifications.push({
          type: "follower",
          content: notificationContent,
        });

        actionMessage = "User unfollowed successfully";
        userFollowed = false;
      }

      // Save changes to both users
      await currentUser.save();
      await userToFollow.save();

      return res.json({
        message: actionMessage,
        userFollowed: userFollowed,
        followingCount: currentUser.following_count,
      });
    } catch (error) {
      console.error("Error following/unfollowing user:", error.toString());
      return res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while processing your request",
      });
    }
  },

  getMyUserProfile: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Need to Login to See your Profile",
        });
      }

      const userId = req.user.id; // Get the logged-in user's ID

      // Fetch user details
      const user = await User.findById(userId)
        .select("-password -resetToken -tokenExpiry")
        .populate("followers.user", "user_name first_name last_name profile_photo_url")
        .populate("following.user", "user_name first_name last_name profile_photo_url")
        .populate("requests.user", "user_name first_name last_name profile_photo_url");

      if (!user) {
        return res.status(constants.NOT_FOUND).json({ message: "User not found" });
      }

      // Fetch user's posts
      const userPosts = await Post.find({ user: userId, type: "post" }).sort({
        createdAt: -1,
      });

      // Fetch user's liked posts
      const likedPosts = await Post.find({ "likes.userId": userId }).sort({
        createdAt: -1,
      });

      return res.json({
        profile: user,
        myposts: userPosts,
        likedPosts,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error.toString());
      return res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while fetching your profile",
      });
    }
  },

  getUserProfile: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Need to Login to See Users Profile",
        });
      }
      const userIdOfPersonToSeeProfile = req.query.user_id;
      // User ID to fetch profile
      const requestingUserId = req.user.id; // ID of the user making the request

      // Validate the required fields
      if (!userIdOfPersonToSeeProfile) {
        return res
          .status(constants.VALIDATION_ERRORS)
          .json({ message: "User ID is required" });
      }
      // Fetch the user's profile
      const userToSeeProfile = await User.findById(userIdOfPersonToSeeProfile)
        .select("-password -resetToken -tokenExpiry -notifications")
        .populate("followers.user", "user_name first_name last_name profile_photo_url")
        .populate("following.user", "user_name first_name last_name profile_photo_url");
      if (!userToSeeProfile) {
        return res.status(constants.NOT_FOUND).json({ message: "User not found" });
      }

      // Handle private accounts
      if (
        userToSeeProfile.is_private &&
        !userToSeeProfile.followers.some(
          (follower) => follower.user.toString() === requestingUserId.toString()
        )
      ) {
        return res.json({
          profile: userToSeeProfile,
          usersposts: [],
          likedPosts: [],
        });
      }

      // Fetch user's posts

      const userPosts = await Post.find({
        user: userIdOfPersonToSeeProfile,
      }).sort({
        createdAt: -1,
      });

      // Fetch user's liked posts
      const likedPosts = await Post.find({
        "likes.userId": userIdOfPersonToSeeProfile,
      }).sort({
        createdAt: -1,
      });
      return res.json({
        profile: userToSeeProfile,
        usersposts: userPosts,
        likedPosts,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error.toString());
      return res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while fetching the user's profile",
      });
    }
  },

  searchUsers: async (req, res) => {
    try {
      // Check if the user is logged in
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "User must be logged in to search for users",
        });
      }

      const { query } = req.query;

      const loggedInUserId = req.user.id;

      // Search for users based on the query or fetch all users if the query is empty
      const searchCriteria =
        query && query.trim() !== ""
          ? {
              $or: [
                { user_name: { $regex: query, $options: "i" } },
                { first_name: { $regex: query, $options: "i" } },
                { last_name: { $regex: query, $options: "i" } },
              ],
            }
          : {};

      // Fetch users and exclude sensitive fields (like password, resetToken, etc.)
      const users = await User.find(searchCriteria)
        .select("-password -resetToken -tokenExpiry -notifications") // Exclude sensitive fields
        .lean();

      // Add the `isFollowing` status, along with user ID, avatar URL, follower and following counts
      const updatedUsers = users.map((user) => {
        const isFollowing = user.followers.some(
          (follower) => follower.user.toString() === loggedInUserId
        );
        return {
          id: user._id, // Append user ID
          user_name: user.user_name,
          first_name: user.first_name,
          last_name: user.last_name,
          avatar_url: user.profile_photo_url, // Use avatar_url for profile photo
          isFollowing,
          followers_count: user.followers_count, // Include followers count
          following_count: user.following_count, // Include following count
          bio: user.bio, // Include Bio
          is_verified: user.is_verified, // Include Bio
        };
      });

      return res.json({
        message: "Search results fetched successfully",
        users: updatedUsers,
      });
    } catch (error) {
      console.error("Error searching users:", error.toString());
      return res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while searching for users",
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = await req.body;

      // Validate required fields
      if (!email) {
        return res.status(400).json({
          message: "Email is required to initiate password reset.",
        });
      }

      const user = await User.findOne({ email });

      console.log(user, "-------------------");

      if (!user) {
        return res.status(404).json({
          message: "No user found with this email address.",
        });
      }

      // Generate a reset token
      console.log("here---------");
      const resetToken = crypto.randomBytes(32).toString("hex");
      const tokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

      user.resetToken = resetToken;
      user.tokenExpiry = tokenExpiry;
      await user.save();

      const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

      // Send the reset link via email
      await transporter.sendMail({
        to: email,
        subject: "Password Reset Request",
        html: `
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>If you did not request this, please ignore this email.</p>
        `,
      });

      res.json({ message: "Password reset link sent successfully." });
    } catch (error) {
      console.error("Forgot Password Error:", error); // Log full error for debugging
      res.status(500).json({
        message: "Error initiating password reset",
        error: error.message || error.toString(),
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      // Validate required fields
      if (!password) {
        return res.status(400).json({
          message: "New password is required to reset password.",
        });
      }

      const user = await User.findOne({
        resetToken: token,
        tokenExpiry: { $gt: Date.now() }, // Ensure the token has not expired
      });

      if (!user) {
        return res.status(400).json({
          message: "Invalid or expired reset token.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
      user.resetToken = undefined;
      user.tokenExpiry = undefined;
      await user.save();

      res.json({ message: "Password reset successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error resetting password", error });
    }
  },

  acceptRequest: async (req, res) => {
    try {
      // Check if the user is logged in
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Can't set Bio if user is not logged in",
        });
      }

      const user = await User.findById(req.user.id);

      const requestId = req.body.requestId;

      const request = user.requests.find((r) => r._id.toString() === requestId);

      if (!request) {
        return res.status(404).json({ success: false, message: "Request not found" });
      }

      const requesterId = request.user;
      const requester = await User.findById(requesterId);




      user.followers.push({ user: requesterId });
      user.followers_count += 1;

      // Add user to requester's following list
      requester.following.push({ user: user._id });
      requester.following_count += 1;

      console.log("user", user.requests);


      // Remove requester from requests list
      user.requests.splice(requestId, 1);

    

      // Save both users
      await user.save();
      await requester.save();

      res.json({ message: "Successfully accepted." });
    } catch (error) {
      res.status(500).json({ message: "Error resetting password", error });
    }
  },
};

module.exports = userController;
