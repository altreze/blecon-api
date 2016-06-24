'use strict';

var restful               = require('node-restful');
var mongoose              = restful.mongoose;
var validate              = require('mongoose-validator');
var passportLocalMongoose = require('passport-local-mongoose');
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

var floorSchema  = new mongoose.Schema({
	//_id 			: { type: 'string', unique: true, default: uuid.v1 },
	name 		 	: { type: 'string', required: true, unique  : true },
	organizationid	: { type: 'string', required: true, unique  : true, validate: nameValidator },
	createdOn 	 	: { type: 'Date'  , required: true, default : Date.now }
});

module.exports = restful.model('floor', floorSchema);