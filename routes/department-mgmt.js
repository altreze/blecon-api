// Department management
var config         = require('../config');
var express        = require('express');
var router         = express.Router();
var jwt            = require('jsonwebtoken');
var passport       = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var department          = require('../models/department');

// Bearer Strategy configuration
passport.use(new BearerStrategy(
	function(token, done) {
		jwt.verify(token, config.jwt.secret, function(err, decoded) {
			if (err) { return done(err); }
			if (!token) { return done(null, false); }
			return done(null, token, { scope: 'all' });
		});
	}
));


module.exports = router;