const express = require("express");
const postController = require("../Controllers/postController");
const adminController = require("../Controllers/adminController");

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
router.delete("/deletePost", validateToken, postController.deletePost);

router.get("/getHashTags", postController.getHashTags);

/************************************************************************
 *
 *  Admin Related Routes
 *
 *************************************************************************/
router.post("/uploadHashTagAdmin", validateToken, adminController.uploadHashTagAdmin);

module.exports = router;
