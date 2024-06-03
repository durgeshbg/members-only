const Message = require('../models/message');

exports.message_list = (req, res, next) => {
  res.send('Message list');
};
