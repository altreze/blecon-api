'use strict';

var restful               = require('node-restful');
var mongoose              = restful.mongoose;
var validate              = require('mongoose-validator');
var passportLocalMongoose = require('passport-local-mongoose');
var uuid                  = require('node-uuid');

var emailValidator = [
	validate({
		validator: 'isEmail',
		message: 'Not a proper email'
	}),
	validate({
		validator: 'isLength',
		arguments: [6, 40],
		message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
	})
];

var nameValidator = [
	validate({
		validator: 'isAlphanumeric',
		message: 'Name should contain alpha-numeric characters only'
	}),
	validate({
		validator: 'isLength',
		arguments: [2, 40],
		message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
	})
];

var accountSchema  = new mongoose.Schema({
	email 		 : { type: 'string', required: true, unique  : true, validate: emailValidator },
	phone 		 : { type: 'string', required: true, unique  : true },
	username 	 : { type: 'string', required: true, unique  : true, validate: nameValidator },
	revoked		 : { type: Boolean , required: true, default : false },
	createdOn 	 : { type: 'Date'  , required: true, default : Date.now },
	organization : {
		uid  : { type: 'string', unique: true, default: uuid.v1 },
		name : { type: 'string', validate: nameValidator },
		country : { type: 'string', validate: nameValidator }
	}
});

accountSchema.plugin(passportLocalMongoose);

module.exports = restful.model('account', accountSchema);