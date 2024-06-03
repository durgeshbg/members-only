const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const moment = require('moment');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  time: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

MessageSchema.virtual('url').get(function () {
  return `/messages/${this._id}`;
});

MessageSchema.virtual('posted_ago').get(function () {
  return moment(this.time).fromNow();
});

module.exports = mongoose.model('Message', MessageSchema);
