const express = require('express');
const router = express.Router();


const Auth = require('../middleware/Auth');
const userController = require('../controllers/userController');

/* Managing login route  */
router.post('/login', userController.user_login);
// end of login route

// Handling bulk student creation
router.post('/adduser',Auth,userController.student_create);

// Route to send otp to mail
router.post('/forgotpassword',userController.send_mail);

// Route to reset password by verifying otp

router.post('/resetpassword',userController.rest_password);

module.exports = router;