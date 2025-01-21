const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    medias: [{ type: String }],
    caption: { type: String },
    likes_count: { type: Number, default: 0 },
    hashtags: [{ type: String }],
    likes: [
      {
        userId: { type: String },
      },
    ],
    type: { type: String, enum: ['post', 'story'], required: true },
    comments_count: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  {
    timestamps: true,
  }
);

// PostSchema.pre('remove', async function (next) {
//   // Remove all comments related to the post
//   await mongoose.model('Comment').deleteMany({ postId: this._id });
  
//   // Remove all reported posts related to the post
//   await mongoose.model('ReportedPost').deleteMany({ postId: this._id });

//   next();
// });

module.exports = mongoose.model('Post', PostSchema);
