const mongoose = require('mongoose');

const HashtagSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt for the document
  });

module.exports = mongoose.model('Hashtag', HashtagSchema);