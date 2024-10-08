const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");


router.post('/login', authController.login);
router.get('/verify-token', authController.verifyToken);
router.post('/logout', authController.logout);
router.post('/sendVerificationCode', authController.sendVerificationCode);
router.post('/resetPassword', authController.resetPassword);

module.exports = router;
