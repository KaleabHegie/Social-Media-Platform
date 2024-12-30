const mongoose = require("mongoose");

const HashtagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Hashtag", HashtagSchema);
