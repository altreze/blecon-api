var mongoose = require('mongoose');

var url = 'mongodb://' 
			+ process.env.mongo_user 
			+ ":"
			+ process.env.mongo_pwd 
			+ "@" 
			+ process.env.mongo_server 
			+ ":" 
			+ process.env.mongo_port  
			+ "/" 
			+ process.env.mongo_db;

mongoose.connect(url,
	function (err) {
		if (err) {
			console.log("Could not connect to DB: " + url);
			console.log('mongo_user ' + process.env.mongo_user);
			console.log('mongo_pwd ' + process.env.mongo_pwd);
			console.log('mongo_server ' + process.env.mongo_server);
			console.log('mongo_port ' + process.env.mongo_port);
			console.log('mongo_db ' + process.env.mongo_db);

			throw err;
		} else {
			console.log('Express server connected to database url ' + url);
		}
	}
);

module.exports = mongoose;