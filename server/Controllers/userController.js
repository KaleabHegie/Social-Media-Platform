const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const { constants } = require("../Utils/constants");

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dwkvbn1vu",
  api_key: "922675774229729",
  api_secret: "zfWlXCOgJU0q4p3yVHZEEo74PnY",
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
      console.log(error.toString());
      res.status(constants.SERVER_ERROR).json({ message: "Error registering user", error });
    }
  },
  login: async (req, res) => {
    try {
      const password = req.body.password;
      const user_name = req.body.username;

      // Check if both username and password are provided
      if (!user_name || !password) {
        return res.status(400).json({ message: "Please provide username and password" });
      }

      // Find the user by username
      const user = await User.findOne({ user_name });

      // Verify the user exists and the password is correct
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
          {
            expiresIn: "30d",
          }
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
};

module.exports = userController;
