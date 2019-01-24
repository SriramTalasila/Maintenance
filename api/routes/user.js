const express = require('express');
const router = express.Router();


const Auth = require('../middleware/Auth');
const userController = require('../controllers/userController');

/* Managing login route  */
router.post('/login', userController.user_login);
// end of login route

router.post('/signup',Auth,(req,res)=>{
    res.json({"w":"e"})
})

module.exports = router;