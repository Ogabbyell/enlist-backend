var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var config = require('./config');

//import routes 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var enroleeRouter = require('./routes/enroleeRouter');
var uploadRouter = require('./routes/uploadRouter');

var compression = require('compression');
var helmet = require('helmet');

//Connect to mongodb Database

const mongoose = require('mongoose');

const url = config.mongoUrl; 

const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Connected successfully to DBserver');
}, (err) => {console.log(err);});

var app = express();

app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(compression()); // compress all routes

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

//mount routes
app.use('/enrolees', enroleeRouter);
app.use('/imageUpload',uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
