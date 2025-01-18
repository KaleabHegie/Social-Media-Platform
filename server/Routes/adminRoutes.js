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

router.get("/getUserDataAdmin", validateToken, adminController.getUserDataAdmin);

router.post("/deleteAccountAdmin", validateToken, adminController.deleteAccountAdmin);

router.get("/getReportedPosts", validateToken, adminController.getReportedPosts);

router.post("/deleteReportedPost", validateToken, adminController.deleteReportedPost);

router.get("/getPostAnalytics", validateToken, adminController.getPostAnalytics);

router.post("/markAsVerifiedAdmin", validateToken, adminController.markAsVerifiedAdmin);








module.exports = router;