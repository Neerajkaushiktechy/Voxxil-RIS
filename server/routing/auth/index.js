const express = require('express');
const router = express.Router();
const authController = require("../../controllers/auth");
const verifyToken = require('../../middleware/tokenVerify');

router.post('/auth/signup', authController.post);
router.post('/auth/login', authController.login);
router.post('/auth/reset-password', authController.resetPassword);
router.post('/auth/update-password',verifyToken, authController.updatePassword);

module.exports = router;