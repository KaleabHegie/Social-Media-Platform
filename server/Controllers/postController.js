const { createUploadthing } = require("uploadthing/express");

// Initialize UploadThing
const f = createUploadthing();

// Define your file router
const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ file }) => {
      console.log("file url", file.url);
    }),
};

// Create the UploadThing Express handler
const { utapi } = createUploadthing({ ourFileRouter });

const postController = {
  uploadPost: async (req, res) => {
    try {
      const { caption } = req.body;
      const files = req.files;

      if (!caption || !files || files.length === 0) {
        return res.status(400).json({ error: 'Caption and at least one file are required' });
      }

      console.log('Received caption:', caption);
      console.log('Number of files:', files.length);

      // Upload files to UploadThing
      const uploadPromises = files.map(async (file) => {
        const fileKey = await utapi.uploadFiles({
          files: [
            {
              name: file.originalname,
              type: file.mimetype,
              buffer: file.buffer,
            },
          ],
          endpoint: "imageUploader",
        });
        return fileKey[0];
      });

      const uploadResults = await Promise.all(uploadPromises);

      // Extract file URLs from upload results
      const fileUrls = uploadResults.map(result => `https://uploadthing.com/f/${result}`);

      // Here you would typically save the post data (caption and file URLs) to your database
      // For this example, we'll just log it
      console.log('Post created:', { caption, fileUrls });

      res.status(200).json({ message: 'Post created successfully', caption, fileUrls });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'An error occurred while creating the post' });
    }
  },
};

module.exports = postController;