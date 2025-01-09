const express = require("express");
const userController = require("../Controllers/userController");
const { validateToken } = require("../MiddleWare/validateTokenHandler");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/check-username", userController.checkUsername);

router.post('/check-email', userController.checkEmail);

router.post("/register", userController.register);

router.post("/login", userController.login);

router.post("/forgot-password", userController.forgotPassword);

router.post("/reset-password/:token", userController.resetPassword);

router.post("/setBio", validateToken, userController.setBio);

router.post("/deleteAccount", validateToken, userController.deleteAccount);

router.post("/setAccountVisibility", validateToken, userController.setAccountVisibility);

router.post("/followUser", validateToken, userController.followUser);

router.get("/getMyUserProfile", validateToken, userController.getMyUserProfile);

router.get("/getUserProfile", validateToken, userController.getUserProfile);

router.post("/dismissNotifications", validateToken, userController.dismissNotifications);

router.get("/getNotifications", validateToken, userController.getNotifications);

router.get("/searchUsers", validateToken, userController.searchUsers);






router.post(
  "/setProfileImage",
  validateToken,
  upload.single("profileImg"),
  userController.setProfileImage
);

module.exports = router;
