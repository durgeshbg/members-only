var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

router.get('/signup', userController.signup_get);
router.post('/signup', userController.signup_post);

router.get('/login', userController.login_get);
router.post('/login', userController.login_post);

module.exports = router;
