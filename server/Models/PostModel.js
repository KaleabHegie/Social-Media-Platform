const { hash } = require("bcrypt");
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", onDelete: "cascade" }, // Cascade delete when user is deleted
    medias: [{ type: String }],
    caption: { type: String },
    likes_count: { type: Number, default: 0 },
    hashtags: [{ type: String }],
    likes: [
      {
        userId: { type: String },
      },
    ],
    type: { type: String, enum: ["post", "story"], required: true },
    comments_count: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);
