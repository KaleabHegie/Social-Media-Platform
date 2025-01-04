const cloudinary = require("cloudinary").v2;
const { constants } = require("../Utils/constants");
const User = require("../Models/UserModel");
const Hashtag = require("../Models/HashTagModel");

const adminController = {
  /************************************************************************
   *
   *
   *
   * To Upload HasTags  - POST /api/uploadHashTagAdmin
   *
   *
   *
   *
   ************************************************************************/
  uploadHashTagAdmin: async (req, res) => {
    try {
      // Check if the user is logged in
      if (!req.user) {
        return res.status(constants.UNAUTHORIZED).json({
          message: "Can't upload HashTags if user is not logged in",
        });
      }

      let { hashtag } = req.body;

      // Check if hashtag is provided
      if (!hashtag) {
        return res.status(constants.VALIDATION_ERRORS).json({
          message: "Hashtag is required",
        });
      }

      // Check if the hashtag already exists
      const existingHashtag = await Hashtag.findOne({ name: hashtag });

      if (existingHashtag) {
        return res.status(constants.VALIDATION_ERRORS).json({
          message: "Hashtag already exists",
          hashtag: existingHashtag,
        });
      }

      hashtag=hashtag.trim().toLowerCase();


      // Create a new hashtag if it doesn't exist
      const newHashtag = new Hashtag({ name: hashtag });
      await newHashtag.save();

      // Return success response
      res.json({
        message: "Hashtag created successfully",
        hashtag: newHashtag,
      });
    } catch (error) {
      console.error("Error uploading hashtag:", error);
      res.status(constants.SERVER_ERROR).json({ error: "An error occurred while uploading the hashtag" });
    }
  },
};

module.exports = adminController;
