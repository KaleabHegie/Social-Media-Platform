const express = require('express');
const postController = require('../Controllers/postController');
const router = express.Router();



/************************************************************************
 *
 *  Post Related Routes
 *
 *************************************************************************/

router.post('/uploadPost', postController.uploadPost);

module.exports = router;
