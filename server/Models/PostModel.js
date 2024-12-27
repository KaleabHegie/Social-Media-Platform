const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  like: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      created_at: { type: Date, default: Date.now },
    },
  ],
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, // For nested comments
  created_at: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  media: [{ type: String }], // Array of URLs
  caption: { type: String },
  likes_count: { type: Number, default: 0 },
  HashTags: [{ type: String }],
  like: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      created_at: { type: Date, default: Date.now },
    },
  ],
  type: { type: String, enum: ['post', 'story'], required: true },
  comments: [CommentSchema],
  comments_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);
