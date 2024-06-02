const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true },
  bio: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  member: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
});

UserSchema.virtual('name').get(function () {
  return this.firstname + ' ' + this.lastname;
});

UserSchema.virtual('dob_formatted').get(function () {
  return DateTime.fromJSDate(this.dob).toLocaleString(DateTime.DATE_MED);
});

UserSchema.virtual('dob_yyyy_mm_dd').get(function () {
  return DateTime.fromJSDate(this.dob).toISODate();
});

module.exports = mongoose.model('User', UserSchema);
