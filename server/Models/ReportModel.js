const mongoose = require('mongoose');

const ReportedPostsSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // References the Post
    users: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // References the User
        reason: { type: String, required: true }, // Reason for reporting
      },
    ],
  },
  {
    timestamps: true, // Includes createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('ReportedPost', ReportedPostsSchema);
