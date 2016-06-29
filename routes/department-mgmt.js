// Department management
var config         = require('../config');
var express        = require('express');
var router         = express.Router();
var jwt            = require('jsonwebtoken');
var passport       = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var floor          = require('../models/floor');
var department     = require('../models/department');

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
	department.find(function (err, departments) {
		if (err) return next(err);
		res.json(departments);
	});
});

router.post('/', passport.authenticate('bearer', { session: false }), function(req, res, next) {
	floor.findById(req.body['floorid'], function(err, floor) {
		if (err)
			res.send(err);

		var department1 = new department({
			name: req.body['name'],
			tags: req.body['tags'],
			organizationid: floor.organizationid,
			placeid: floor.placeid,
			floorid: req.body['floorid']
		});

		department1.save(function(err) {
			if (err)
				res.send(err);
			res.json({ code: 200, message: 'department saved successfully', error: null});
		});
	});
});

router.get('/:id', passport.authenticate('bearer', { session: false }), function(req, res) {
	department.findById(req.params.id, function(err, department) {
		if (err)
			res.send(err);
		res.json(department);
	})
});

router.put('/:id', passport.authenticate('bearer', { session: false }), function(req, res){
	res.json({hello: 'Put method'});
});

router.delete('/:id', passport.authenticate('bearer', { session: false }), function(req, res){
	department.remove({_id: req.params.id}, function(err, department) {
		if (err)
			res.send(err);
		res.json({code: 200, message: 'department deleted successfully', error: null});
	});
});

module.exports = router;