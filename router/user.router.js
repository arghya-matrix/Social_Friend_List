const express = require('express')
const router = express.Router();
const userController = require('../controllers/user.controller');
const userMiddleware = require('../middleware/validateUserData');
const tokenVerify = require('../middleware/tokenVerify');

router.post("/signUp",[userMiddleware.validateEmail,userMiddleware.validateName],userController.signUp);
router.post("/logIn",userController.signIn);
router.post("/logOut", tokenVerify.userProfile,userController.logOut);

module.exports = router