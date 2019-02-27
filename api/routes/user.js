const express = require('express');
const router = express.Router();


const Auth = require('../middleware/Auth');
const userController = require('../controllers/userController');

/* Managing login route  */
router.post('/login', userController.user_login);

// Route to send otp to mail
router.post('/forgotpassword',userController.send_mail);

// Route to reset password by verifying otp
router.post('/resetpassword',userController.rest_password);

//Route to Student signup
router.post('/signup',userController.user_signup);

router.get('/verifymail',userController.user_verify);

module.exports = router;