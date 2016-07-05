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
		arguments: [2, 50],
		message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
	})
];

var departmentSchema  = new mongoose.Schema({
	_id 			: { type: 'string', required: true, unique: true, default: uuid.v1 },
	name 			: { type: 'string', required: true, unique: true },
	tags			: { type : Array , 'default' : [] },
	organizationid	: { type: 'string', required: true, validate: nameValidator },
	placeid			: { type: 'string', required: true, validate: nameValidator },
	floorid			: { type: 'string', required: true, validate: nameValidator },
	createdOn 		: { type: 'Date'  , required: true, default : Date.now }
});

module.exports = restful.model('department', departmentSchema);