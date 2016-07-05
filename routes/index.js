var express = require('express');
var router = express.Router();

router.get('/',function(req, res, next) { // jshint ignore:line
	res.json({'message': 'version blecon 1.0'});
});

module.exports = router;
