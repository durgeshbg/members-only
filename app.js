const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const messageRouter = require('./routes/message');

require('dotenv').config();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// mongo db connection
mongoose
  .connect(process.env.MONGOURI)
  .then((msg) => console.log('Connected to DB'))
  .catch((error) => console.log(error));
mongoose.set('strictQuery', false);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGOURI,
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(flash());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/messages', messageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.locals.status = err.status || 500;
  // render the error page
  res.status(err.status || 500);
  res.render('error', { user: req.user });
});

module.exports = app;
