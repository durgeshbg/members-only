const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');

exports.index = (req, res, next) => {
  res.redirect('/messages');
};

exports.about = (req, res, next) => {
  res.render('about', { title: 'About' });
};

exports.profile = (req, res, next) => {
  res.render('profile', { title: 'Profile', user: req.user });
};

exports.joinclub_get = (req, res) => {
  res.render('joinclub', { title: 'Join Club', user: req.user });
};

exports.joinclub_post = [
  body('key')
    .trim()
    .toLowerCase()
    .custom((key) => {
      if (key === 'quicksort') return true;
      return false;
    })
    .withMessage('Incorrect key'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('joinclub', {
        title: 'Join Club',
        key: req.body.key,
        user: req.user,
        errors: errors.array(),
      });
    } else {
      try {
        await User.findByIdAndUpdate(req.body.user_id, { member: true });
        res.redirect('/profile');
      } catch (e) {
        next(e);
      }
    }
  }),
];
