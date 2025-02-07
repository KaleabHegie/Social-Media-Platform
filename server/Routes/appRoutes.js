const express = require("express");
const postController = require("../Controllers/postController");
const commentController = require("../Controllers/commentController");
const messageController  = require('../Controllers/messageController');

// Example usage in a route:

const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { validateToken } = require("../MiddleWare/validateTokenHandler");

/************************************************************************
 *
 *  Post Related Routes
 *
 *************************************************************************/

router.post(
  "/uploadPost",
  validateToken,
  upload.array("files"),
  postController.uploadPost
);


router.post("/deletePost", validateToken, postController.deletePost);

router.get("/getHashTags", postController.getHashTags);

router.post("/likePost", validateToken, postController.likePost);

router.get("/getHomeFeed", validateToken, postController.getHomeFeed);

router.get("/getSinglePost", validateToken, postController.getSinglePost);


router.get("/getStories", validateToken, postController.getStories);

router.get("/getExploreFeed", validateToken, postController.getExploreFeed);

router.post('/reportPost', validateToken , postController.reportPost);





router.get('/fetchMessages', validateToken , messageController.fetchMessages);


router.get('/fetchMessagesGroup', validateToken , messageController.fetchMessagesGroup);





/************************************************************************
 *
 *  Comment Related Routes
 *
 *************************************************************************/

router.post(
  "/makeComment",
  validateToken,
  commentController.makeComment
);
router.delete("/deleteComment", validateToken, commentController.deleteComment);

router.get("/getComments", validateToken, commentController.getComments);

router.post("/likeComment", validateToken, commentController.likeComment);







module.exports = router;
