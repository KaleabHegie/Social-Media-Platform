const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;
const { constants } = require("../Utils/constants");
const crypto = require("crypto");

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
      console.log(req.body);

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
      console.log(error.toString());
      res
        .status(constants.SERVER_ERROR)
        .json({ message: "Error registering user", error });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Please provide username and password" });
      }
      const user = await User.findOne({ user_name: username });

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

        return res.status(200).json({ accessToken });
      } else {
        return res.status(401).json({ message: "Invalid username or password" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ message: "An internal server error occurred" });
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
      let { newBio } = req.body;
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
          message: "Can't set Account Visibility  if user is not logged in",
        });
      }
      let { is_private } = req.body;
      if (!is_private) {
        return res.status(constants.VALIDATION_ERRORS).json({
          message: "Visibility Value is required",
        });
      }

      // Find the user by ID
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "User not found",
        });
      }

      user.is_private = is_private;
      await user.save();

      res.json({
        message: "Account Visibility updated successfully",
      });
    } catch (error) {
      console.error("Error setting Account Visibility:", error.toString());
      res.status(constants.SERVER_ERROR).json({
        message: "An error occurred while setting Account Visibility",
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
      await User.findByIdAndDelete(req.user.id);

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

      const userIdToFollow = req.query.userId; // User ID to follow/unfollow
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
          return res
            .status(constants.UNAUTHORIZED)
            .json({ message: "You cannot follow Private Accounts" });
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

  forgotPassword: async (req, res) => {
    console.log(req);
    try {
      const { email } = await req.body;

      console.log(req.body);

      // Validate required fields
      if (!email) {
        return res.status(400).json({
          message: "Email is required to initiate password reset.",
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "No user found with this email address.",
        });
      }

      // Generate a reset token
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

      console.log(req.body);

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
      console.log(error.toString());
      res.status(500).json({ message: "Error resetting password", error });
    }
  },
};

module.exports = userController;
