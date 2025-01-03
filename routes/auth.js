var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');
const { isAuth, isNotAuth } = require('./authMiddleware');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) return done(null, false, { message: 'Username invalid' });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: 'Incorrect password' });
      return done(null, user);
    } catch (error) {
      done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

router.get('/signup', isNotAuth, authController.signup_get);
router.post('/signup', isNotAuth, authController.signup_post);

router.get('/login', isNotAuth, authController.login_get);
router.post('/login', isNotAuth, authController.login_post);

router.get('/logout', isAuth, authController.logout);

module.exports = router;
