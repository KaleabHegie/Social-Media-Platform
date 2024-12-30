const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const postController = {
  uploadPost: async (req, res) => {
    try {
      const { files, postData } = req.body;

      const allowedMimeTypes = ["image/", "video/"];
      const isValidFile = (file) =>
        allowedMimeTypes.some((type) => file.type.startsWith(type));

      if (!files.every(isValidFile)) {
        return res.status(400).json({ error: "Invalid file type" });
      }

      // Upload files to UploadThing
      const uploadResponse = await uploadFiles({
        files,
        route: "uploadthing", // Ensure this matches your server route
      });

      console.log("Uploaded Files:", uploadResponse);

      // Process post data with uploaded file URLs
      const fileUrls = uploadResponse.map((file) => file.fileUrl);
      const postPayload = {
        ...postData,
        fileUrls, 
      };

      return res.status(200).json({ success: true, data: postPayload });
    } catch (error) {
      console.error("Error uploading files:", error);
      return res.status(500).json({ error: "File upload failed" });
    }
  },
};

module.exports = postController;
