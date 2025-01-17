const mongoose = require("mongoose");
const Post = require("./PostModel"); // Import Post model to access the related posts

// Notification Sub-Schema
const NotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["like", "comment", "follower", "other"],
      default: "other",
      required: true,
    },
    content: { type: String, required: true },
    seen: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// User Schema
const UserSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    date_of_birth: { type: Date, required: false },
    gender: { type: String, enum: ["male", "female"], required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_private: { type: Boolean, required: false, default: false },
    profile_photo_url: { type: String },
    bio: { type: String },
    followers_count: { type: Number, default: 0 },
    following_count: { type: Number, default: 0 },
    post_count: { type: Number, default: 0 },
    followers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    following: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    is_admin: { type: Boolean, default: false },
    notifications: [NotificationSchema],

    resetToken: { type: String, default: null },
    tokenExpiry: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// // Pre delete hook for User
// UserSchema.pre('deleteOne', async function (next) {
//   const userId = this._id;  // Get the userId of the document about to be deleted

//   try {
//     // Delete all posts related to the user
//     await Post.deleteMany({ user: userId });
//     next();  // Proceed with the deletion
//   } catch (error) {
//     next(error);  // Handle any errors
//   }
// });

module.exports = mongoose.model("User", UserSchema);
