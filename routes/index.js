var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController');
const { isAuth } = require('./authMiddleware');

/* GET home page. */
router.get('/', indexController.index);

router.get('/profile', indexController.profile);

router.get('/joinclub', isAuth, indexController.joinclub_get);
router.get('/joinclub', isAuth, indexController.joinclub_post);

module.exports = router;
