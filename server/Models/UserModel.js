const mongoose = require("mongoose");

// Notification Sub-Schema
const NotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["like", "comment", "follower", "other"],
      default: "other",
      required: true,
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
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
      {
        timestamps: true,
      },
    ],
    following: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
      {
        timestamps: true,
      },
    ],
    is_admin: { type: Boolean, default: false },
    notifications: [NotificationSchema],

    resetToken: { type: String, default: null },  // To store the reset token
    tokenExpiry: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
