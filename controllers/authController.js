const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
require('dotenv').config();

exports.signup_get = (req, res, next) => {
  res.render('signup', { title: 'Sign Up' });
};

exports.signup_post = [
  body('firstname', 'First name required').trim().isLength({ min: 1 }),
  body('lastname', 'Last name required').trim().isLength({ min: 1 }),
  body('username', 'User name required')
    .trim()
    .isLength({ min: 1 })
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error('Username already in use');
      }
    }),
  body('bio', 'Bio too short').trim().isLength({ min: 5 }),
  body('dob', 'Date required').isISO8601().toDate(),
  body('email')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email'),
  body('password', 'Password required').trim().isLength({ min: 1 }),
  body('cpassword', 'Please confirm your password')
    .trim()
    .isLength({ min: 1 })
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords don't match"),
  body('admin', 'Incorrect admin key')
    .trim()
    .optional({ values: 'falsy' })
    .custom((value) => {
      if (value === process.env.SECRET) return true;
      return false;
    }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      bio: req.body.bio,
      dob: req.body.dob,
      email: req.body.email,
      password: hash,
    });
    if (req.body.admin) {
      user.admin = true;
      user.member = true;
    }
    if (!errors.isEmpty()) {
      res.render('signup', { title: 'Sign Up', user, errors: errors.array() });
    } else {
      await user.save();
      req.login(user, (err) => {
        if (err) next(err);
        return res.redirect('/profile');
      });
    }
  }),
];

exports.login_get = (req, res, next) => {
  res.render('login', { title: 'Log In', error: req.flash('error') });
};

exports.login_post = passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
});

exports.logout = (req, res, next) => {
  res.clearCookie('connect.sid');
  req.logout((err) => {
    if (err) next(err);
    req.session.destroy((err) => {
      if (err) next(err);
    });
  });
  res.redirect('/');
};
