const mongoose = require('mongoose');

// Notification Sub-Schema
const NotificationSchema = new mongoose.Schema({
        type: { type: String, enum: ['like', 'comment', 'follower' , 'other'], default: 'other', required: true },
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' , required: true}, 
        content : {type: String , required: true},
        seen : {type: Boolean , default: false},
    },{
        timestamps: true
    });

// User Schema
const UserSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profile_photo_url: { type: String },
        bio: { type: String },
        followers_count: { type: Number, default: 0 },
        following_count: { type: Number, default: 0 },
        post_count: { type: Number, default: 0 },
        followers: [
          {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            created_at: { type: Date, default: Date.now },
          },
        ],
        following: [
          {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            created_at: { type: Date, default: Date.now },
          },
        ],
        notifications: [NotificationSchema], 
  },{
        timestamps: true
  });

module.exports = mongoose.model('User', UserSchema);
