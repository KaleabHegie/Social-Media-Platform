const express = require('express');
const userController = require('../Controllers/userController');
const adminController = require("../Controllers/adminController");
const { validateToken } = require("../MiddleWare/validateTokenHandler");

const router = express.Router();


/************************************************************************
 *
 *  Admin Related Routes
 *
 *************************************************************************/
router.post("/uploadHashTagAdmin", validateToken, adminController.uploadHashTagAdmin);


module.exports = router;