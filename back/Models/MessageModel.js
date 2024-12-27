const mongoose = require('mongoose');

// Message Sub-Schema
const MessageSubSchema = new mongoose.Schema({
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true}, 
        media: { type: String, required: False}, 
    },
    {
        timestamps: true, 
  });

// Main Message Schema
const MessageSchema = new mongoose.Schema(
  {
    chat_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    participants: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        last_opened_at: { type: Date, default: Date.now },
      },
    ],
    messages: [MessageSubSchema], 
  },
  {
    timestamps: true, // Adds createdAt and updatedAt for the document
  }
);


// Export Model
module.exports = mongoose.model('Message', MessageSchema);
