'use strict';

var restful               = require('node-restful');
var mongoose              = restful.mongoose;
var validate              = require('mongoose-validator');
var uuid                  = require('node-uuid');

var nameValidator = [
	// validate({
	// 	validator: 'isAlphanumeric',
	// 	message: 'Name should only contain alpha-numeric characters'
	// }),
	validate({
		validator: 'isLength',
		arguments: [2, 100],
		message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
	})
];

var addressValidator = [
	// validate({
	// 	validator: 'isAlphanumeric',
	// 	message: 'Address should only contain alpha-numeric characters'
	// }),
	validate({
		validator: 'isLength',
		arguments: [10, 200],
		message: 'Address should be between {ARGS[0]} and {ARGS[1]} characters'
	})
];

var placeSchema  = new mongoose.Schema({
	_id 			: { type: 'string', unique: true, default: uuid.v1 },
	name 			: { type: 'string', required: true, unique  : true, validate: nameValidator },
	organizationid	: { type: 'string', required: true, validate: nameValidator },
	address 		: { type: 'string', required: true, validate: addressValidator },
	createdOn 		: { type: 'Date' , required: true, default : Date.now },
	updateAt 		: { type: 'Date' },
	isDeleted   	: { type: Boolean , required: true, default : false }
});

module.exports = restful.model('place', placeSchema);