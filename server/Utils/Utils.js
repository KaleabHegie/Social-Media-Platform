import { createUploadthing } from 'uploadthing/server';

// Define your file router for images and videos
const uploadthing = createUploadthing();
export const fileRouter = uploadthing
  .fileTypes(['image', 'video']) // Restrict to images and videos
  .maxSize('10MB') // Set max file size
  .onUploadComplete(({ file }) => {
    console.log('File uploaded:', file);
  });


class Utils {
    static TOKEN_EXPIRATION_TIME = "30d"; 
    static uploadRouter = {
        // Define as many FileRoutes as you like, each with a unique routeSlug
        imageUploader: f({
          image: {
            /**
             * For full list of options and defaults and defaults, see the File Route API reference
             * @see https://docs.uploadthing.com/file-routes#route-config
             */
            maxFileSize: "4MB",
            maxFileCount: 1,
          },
        }).onUploadComplete((data) => {
          console.log("upload completed", data);
        }).onUploadError,
      } 

}



module.exports = Utils;