var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});

router.get('/profile', (req, res, next) => {
  res.render('profile', { title: 'Profile', user: req.user });
});

module.exports = router;
