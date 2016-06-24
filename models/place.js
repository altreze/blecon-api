'use strict';

var restful               = require('node-restful');
var mongoose              = restful.mongoose;
var validate              = require('mongoose-validator');

var nameValidator = [
	validate({
		validator: 'isAlphanumeric',
		message: 'Name should only contain alpha-numeric characters'
	}),
	validate({
		validator: 'isLength',
		arguments: [6, 100],
		message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
	})
];

var addressValidator = [
	validate({
		validator: 'isAlphanumeric',
		message: 'Address should only contain alpha-numeric characters'
	}),
	validate({
		validator: 'isLength',
		arguments: [10, 200],
		message: 'Address should be between {ARGS[0]} and {ARGS[1]} characters'
	})
];

var place  = new mongoose.Schema({
	name 		: { type: 'string', required: true, unique  : true, validate: nameValidator },
	address 	: { type: 'string', required: true, validate: addressValidator },
	createdOn 	: { type: 'Date'  , required: true, default : Date.now },
	updateAt 	: { type: 'Date'  , required: true }
});

module.exports = restful.model('place', place);