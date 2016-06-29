// Beacon management
var config         = require('../config');
var express        = require('express');
var router         = express.Router();
var jwt            = require('jsonwebtoken');
var passport       = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var department     = require('../models/department');
var beacon         = require('../models/beacon');

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
	beacon.find(function (err, beacons) {
		if (err) return next(err);
		res.json(beacons);
	});
});

router.post('/', passport.authenticate('bearer', { session: false }), function(req, res, next) {
	department.findById(req.body['departmentid'], function(err, department) {
		if (err)
			res.send(err);

		// WIP : point is not yet saved to db
		beacon1 = new beacon({
			name: req.body['name'],
			organizationid: department.organizationid,
			data: req.body['data'],	
			departmentid: req.body['departmentid'],
		});

		beacon1.save(function(err) {
			if (err)
				res.send(err);
			res.json({ code: 200, message: 'beacon saved successfully', error: null});
		});
	});
});

router.get('/:ops/:field', passport.authenticate('bearer', { session: false }), function(req, res) {
	switch(req.params.ops) {
		case 'id' :
			beacon.findById(req.params.field, function(err, beacon) {
				if (err)
					res.send(err);
				res.json(beacon);
			});
			break;
		case 'instanceid' :
			beacon.find({'data.instanceid': req.params.field}, function(err, beacon) {
				if (err)
					res.send(err);
				res.json(beacon);
			});
			break;
		default:
			res.json("Didn't match");
			break;
	}
});

router.put('/:id', passport.authenticate('bearer', { session: false }), function(req, res){
	res.json({hello: 'Put method'});
});

router.delete('/:ops/:field', passport.authenticate('bearer', { session: false }), function(req, res) {
	switch(req.params.ops) {
		case 'id' :
				beacon.remove({_id: req.params.field}, function(err, beacon) {
					if (err)
						res.send(err);
					res.json({code: 200, message: 'beacon deleted successfully', error: null});
				});
			break;
		case 'instanceid' :
			beacon.remove({'data.instanceid': req.params.field}, function(err, beacon) {
					if (err)
						res.send(err);
					res.json({code: 200, message: 'beacon deleted successfully', error: null});
				});
			break;
		default:
			res.json("Didn't match");
			break;
	}
});

module.exports = router;