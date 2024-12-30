const { createUploadthing } = require('uploadthing/express');


// Initialize UploadThing
const f = createUploadthing();

// Define your file router
const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ file }) => {
      console.log("file url", file.url);
    }),
};


module.exports = ourFileRouter;