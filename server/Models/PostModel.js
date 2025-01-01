const { hash } = require("bcrypt");
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    likes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  },
  {
    timestamps: true,
  }
);

// Adding a post delete hook to remove all comments when the post is deleted
CommentSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const comment = this;
  await Comment.deleteMany({ parent: comment._id }); // Delete all comments that have this comment as their parent
  next();
});

const PostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", onDelete: "cascade" }, // Cascade delete when user is deleted
    medias: [{ type: String }],
    caption: { type: String },
    likes_count: { type: Number, default: 0 },
    hashtags: [{ type: String }],
    likes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    type: { type: String, enum: ["post", "story"], required: true },
    comments: [CommentSchema],
    comments_count: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);
