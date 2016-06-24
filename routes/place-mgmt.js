/// user management api
var config         = require('../config');
var express = require('express');
var router = express.Router();
var jwt            = require('jsonwebtoken');
var passport       = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var place        = require('../models/place');

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

router.get('/', passport.authenticate('bearer', { session: false }), function(req, res, next) {
	res.json({
		code: 200,
		method: 'Authentication',
		msg1: req.headers['content-type'],
		msg2: req.headers['authorization'],
		message: 'Authentication is done',
		error: null
	});
});

module.exports = router;