const { hash } = require('bcrypt');
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
        parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, 
    },{
        timestamps: true,
    });

const PostSchema = new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        media: [{ type: String }], 
        caption: { type: String },
        likes_count: { type: Number, default: 0 },
        hashtags : [{ type: mongoose.Schema.Types.ObjectId, ref: 'HashTags' }],
        like: [
          {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            created_at: { type: Date, default: Date.now },
          },
        ],
        type: { type: String, enum: ['post', 'story'], required: true },
        comments: [CommentSchema],
        comments_count: { type: Number, default: 0 },
    },{
        timestamps: true,
    });

module.exports = mongoose.model('Post', PostSchema);
