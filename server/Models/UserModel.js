const mongoose = require("mongoose");
const Post = require("./PostModel"); // Import Post model to access the related posts

// Notification Sub-Schema
const NotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["like", "comment", "follower", "requests" ,"other"],
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
    requests: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    is_admin: { type: Boolean, default: false },
    is_verified: { type: Boolean, default: false },

    notifications: [NotificationSchema],

    resetToken: { type: String, default: null },
    tokenExpiry: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);


// // Pre-remove middleware to delete posts when a user is deleted
// UserSchema.pre('remove', async function(next) {
//   // Remove all posts associated with this user
//   await Post.deleteMany({ user: this._id });
//   next();
// });

module.exports = mongoose.model("User", UserSchema);


module.exports = mongoose.model("User", UserSchema);
