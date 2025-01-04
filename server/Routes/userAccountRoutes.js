const express = require("express");
const userController = require("../Controllers/userController");
const { validateToken } = require("../MiddleWare/validateTokenHandler");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", userController.register);
router.get("/login", userController.login);
router.post("/setBio", validateToken, userController.setBio);

router.post("/deleteAccount", validateToken, userController.deleteAccount);

router.post("/setAccountVisibility", validateToken, userController.setAccountVisibility);


router.post(
  "/setProfileImage",
  validateToken,
  upload.single("profileImg"),
  userController.setProfileImage
);

module.exports = router;
