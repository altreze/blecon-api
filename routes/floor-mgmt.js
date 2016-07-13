// Floor management
var config         = require('../config');
var express        = require('express');
var router         = express.Router();
var jwt            = require('jsonwebtoken');
var passport       = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var floor          = require('../models/floor');
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
	floor.find(function (err, floors) {
		if (err) return next(err);
		res.json(floors);
	});
});

router.post('/', passport.authenticate('bearer', { session: false }), function(req, res, next) {
	place.findById(req.body['placeid'], function(err, place) {
		if (err)
			res.send(err);
		
		// WIP : Must add geo points 
		var floor1 = new floor({ 
			name: req.body['name'], 
			placeid: req.body['placeid'], 
			organizationid: place.organizationid,
			points: req.body['points']
		});

		floor1.save(function(err) {
			if (err)
				res.send(err);
			res.json({ code: 200, message: 'floor saved successfully', error: null});
		});
	});
});

router.get('/:id', passport.authenticate('bearer', { session: false }), function(req, res) {
	floor.findById(req.params.id, function(err, floor) {
		if (err)
			res.send(err);
		res.json(floor);
	})
});

router.put('/:id', passport.authenticate('bearer', { session: false }), function(req, res){
	res.json({hello: 'Put method'});
});

router.delete('/:id', passport.authenticate('bearer', { session: false }), function(req, res){
	floor.remove({_id: req.params.id}, function(err, floor) {
		if (err)
			res.send(err);
		res.json({code: 200, message: 'floor deleted successfully', error: null});
	});
});

module.exports = router;