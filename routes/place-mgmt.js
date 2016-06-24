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
	place.find(function (err, places) {
		if (err) return next(err);
			res.json(places);
	});
});

router.post('/', passport.authenticate('bearer', { session: false }), function(req, res, next) {
	var place1 = new place({name: req.body['name'], address: req.body['address']});

	place1.save(function(err) {
		if (err)
			res.send(err);
		res.json({ code: 200, message: 'place saved successfully', error: null});
	});
});

router.get('/:id', passport.authenticate('bearer', { session: false }), function(req, res) {
	place.findById(req.params.id, function(err, place) {
		if (err)
			res.send(err);
		res.json(place);
	})
});

router.put('/:id', passport.authenticate('bearer', { session: false }), function(req, res){
	res.json({hello: 'Put method'});
});

router.delete('/:id', passport.authenticate('bearer', { session: false }), function(req, res){
	place.remove({_id: req.params.id}, function(err, place) {
		if (err)
			res.send(err);
		res.json({code: 200, message: 'place deleted successfully', error: null});
	});
});

module.exports = router;