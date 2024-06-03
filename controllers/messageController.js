const { body, validationResult } = require('express-validator');
const Message = require('../models/message');
const { isAuth } = require('../routes/authMiddleware');
const asyncHandler = require('express-async-handler');

exports.message_list = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({})
    .populate({
      path: 'user',
      select: 'username',
    })
    .exec();
  res.render('index', { title: 'Messages', user: req.user, messages });
});

exports.message_create_get = [
  isAuth,
  (req, res, next) => {
    res.render('message_form', { title: 'Create Message', user: req.user });
  },
];
exports.message_create_post = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title required'),
  body('body').trim().isLength({ min: 10 }).withMessage('Body too short'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const message = new Message({
      title: req.body.title,
      body: req.body.body,
      user: req.body.user_id,
    });
    if (!errors.isEmpty()) {
      res.render('message_form', {
        title: 'Create Message',
        user: req.user,
        errors: errors.array(),
        message,
      });
    } else {
      await message.save();
      res.redirect('/messages');
    }
  }),
];

exports.message_delete = asyncHandler(async (req, res, next) => {
  await Message.findByIdAndDelete(req.body.message_id);
  res.redirect('/messages');
});
