var express = require('express');
var router = express.Router();
const { isAuth } = require('./authMiddleware');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});

router.get('/profile', isAuth, (req, res, next) => {
  res.render('profile', { title: 'Profile', user: req.user });
});

module.exports = router;
