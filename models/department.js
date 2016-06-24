'use strict';

var restful               = require('node-restful');
var mongoose              = restful.mongoose;
var validate              = require('mongoose-validator');
var passportLocalMongoose = require('passport-local-mongoose');
var uuid                  = require('node-uuid');



var departmentSchema  = new mongoose.Schema({
	email 		 : { type: Number, required: true, unique  : true },
	name 		 : { type: 'string', required: true, unique  : true },
	createdOn 	 : { type: 'Date'  , required: true, default : Date.now }
});

module.exports = restful.model('department', departmentSchema);