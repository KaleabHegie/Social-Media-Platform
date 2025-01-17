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

router.get("/getUserDataAdmin", validateToken, adminController.getUserDataAdmin);

router.delete("/deleteAccountAdmin", validateToken, adminController.deleteAccountAdmin);

router.get("/getReportedPosts", validateToken, adminController.getReportedPosts);

router.delete("/deleteReportedPost", validateToken, adminController.deleteReportedPost);

router.get("/getPostAnalytics", validateToken, adminController.getPostAnalytics);







module.exports = router;