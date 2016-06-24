var express = require('express');
var path = require('path');
var logger = require('./utils/logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var app = express();

// Loading configuration
var config = require('./config');

// Connection to MongoDB
var mongo = require('./connection');

// Configuration middleware
app.use(require('morgan')('combined', { "stream": logger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret            : config.session.secret,
    key               : config.session.key,
    resave            : false,
    saveUninitialized : false
}));

// Passportjs Configuration
app.use(passport.initialize());
app.use(passport.session());

// Content-Type configuration
app.use('/', function(req, res, next) {
  var contype = req.headers['content-type'];
  if (!contype || contype.indexOf('application/json') !== 0)
    return res.send(400);
  next();
});

// Routes configuration
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/account-mgmt'));
app.use('/places', require('./routes/place-mgmt'));
app.use('/floors', require('./routes/floor-mgmt'));
app.use('/departments', require('./routes/department-mgmt.js'));
app.use('/beacons', require('./routes/beacon-mgmt.js'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;
