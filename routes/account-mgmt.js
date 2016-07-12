/// user management api
var config         = require('../config');
var express = require('express');
var router = express.Router();
var jwt            = require('jsonwebtoken');
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var account        = require('../models/account');

var ExpressBrute = require('express-brute');
var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production 
var bruteforce = new ExpressBrute(store, {
	freeRetries : 5,
	minWait     : 5 * 60 * 1000, // 5 minutes
	maxWait     : 60 * 60 * 1000, // 1 hour,
});

passport.use(new LocalStrategy(account.authenticate()));
passport.serializeUser(account.serializeUser());
passport.deserializeUser(account.deserializeUser());

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

router.get('/',function(req, res, next) {
	res.json({'message': 'user management framework'});
});

router.post('/login', bruteforce.prevent, function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if(err) {
			res.json({code: 500, message: 'unexpected error'});
		} else if (!user) {
			res.json({code: 201, message: 'user not found'});
		} else {
			req.login(user, function(err) {
				if(err) {
					res.json({code: 201, message: 'wrong password'});
				} else {
					var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
					res.json({code: 200, token: jwt.sign({
						issuer: req.body['username']
					}, config.jwt.secret, { expiresIn: config.jwt.expires })});
				}
			})
		}
	})(req, res, next);	
	}, function(err, req, res, next) {
		return res.json({code: 201, status: 'err','message': 'Something wrong', error: err});
});

router.post('/register', bruteforce.prevent, function(req, res) {
	account.register(new account({email: req.body['email'], 
		phone: req.body['phone'],
		username: req.body['username']}), req.body['password'], function(err, account) {
			if (err)
				res.status(400).send(err);
			else {
				res.json({ code: 200, message: 'account saved successfully', error: null });
			}
	})
});

router.get('/authenticate', bruteforce.prevent, passport.authenticate('bearer', { session: false }), 
	function(req, res, next) {
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