const cloudinary = require('cloudinary').v2;


// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dwkvbn1vu",
  api_key: "922675774229729",
  api_secret: "zfWlXCOgJU0q4p3yVHZEEo74PnY",
});


const postController = {
  uploadPost: async (req, res) => {
    try {
      const { caption } = req.body;
      const files = req.files;

      if (!caption || !files || files.length === 0) {
        return res
          .status(400)
          .json({ error: "Caption and at least one file are required" });
      }

      console.log("Received caption:", caption);
      console.log("Number of files:", files.length);

      console.log( process.env.CLOUDINARY_API_KEY);
      // Upload files to UploadThing

      const fileUrls = [];

      for (const file of files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto',folder: 'posts' },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
      
          // Use file.buffer to pass the file data
          stream.end(file.buffer);
        });
      
        fileUrls.push(result.secure_url);
      }
      

      console.log("Post created:", { caption, fileUrls });

      res.status(200).json({ message: "Post created successfully", caption, fileUrls });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "An error occurred while creating the post" });
    }
  },
};

module.exports = postController;
