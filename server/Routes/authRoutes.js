const express = require('express');
const userController = require('../Controllers/authController');
const router = express.Router();


router.post('/register', userController.register);
router.get('/login', userController.login);

module.exports = router;