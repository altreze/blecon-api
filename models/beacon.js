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
		arguments: [2, 50],
		message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
	})
];

var descriptionValidator = [
	validate({
		validator: 'isLength',
		arguments: [0, 300],
		message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
	})
];

var beaconSchema  = new mongoose.Schema({
	_id 	   	     : { type: 'string', required: true, unique  : true, default: uuid.v1 },
	name 		     : { type: 'string', required: true, unique  : true },
	type 		     : { type: 'string', required: true, default : 'Eddystone beacon' },
	descriptionValidator	     : { type: 'string', validate: descriptionValidator },
	data			 : {
		instanceid   : { type: 'string', required: true, unique : true},
		namespaceid  : { type: 'string', required: true },
		uuid 		 : { type: 'string', required: true, validate: nameValidator },
		major     	 : { type: 'string', required: true },
		minor     	 : { type: 'string', required: true },
		point		 : { lat: 'string', lon: 'string' }
	},
	organizationid	 : { type: 'string', required: true, validate: nameValidator },
	departmentid     : { type: 'string', required: true, validate: nameValidator },
	createdOn 	     : { type: 'Date'  , required: true, default : Date.now }
});

// Ensure indexes
beaconSchema.index({'name': 1}, { unique: true });
beaconSchema.index({'description': 'text'});
beaconSchema.index({'data.instanceid': 1}, { unique: true });
beaconSchema.index({'data.uuid': 1 , 'data.major': 1 , 'data.minor': 1}, { unique: true });

module.exports = restful.model('beacon', beaconSchema);