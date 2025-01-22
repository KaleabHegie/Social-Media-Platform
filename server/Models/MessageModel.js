const mongoose = require('mongoose');

// Message Sub-Schema
const MessageSubSchema = new mongoose.Schema({
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true}, 
        media: { type: String, required: false}, 
    },
    {
        timestamps: true, 
  });

// Main Message Schema
const MessageSchema = new mongoose.Schema(
  {
        
        name : { type: String, required: false}, 
        is_group : {type : Boolean , default : false},
        participants: [
          {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            is_group_admin : {type : Boolean , default : false},
            last_opened_at: { type: Date, default: Date.now },
          },
        ],
        messages: [MessageSubSchema], 
  },
  {
        timestamps: true, 
  }
);

module.exports = mongoose.model('Message', MessageSchema);
