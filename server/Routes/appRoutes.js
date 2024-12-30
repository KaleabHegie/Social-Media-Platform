const express = require('express');
const postController = require('../Controllers/postController');
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });


/************************************************************************
 *
 *  Post Related Routes
 *
 *************************************************************************/

router.post('/uploadPost', upload.array('files'),postController.uploadPost);

module.exports = router;
