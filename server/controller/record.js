var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/AccessControl2';


var record = {};

record.path = '/test/records';

record.post = function(req,res, next){
	console.log('record post');
	res.send('post');
};

record.get = function(req,res,next){

	var docs = [];
	console.log('record get');
	var findRecords = function(db, callback) {
		var cursor = db.collection('record').find(
			{ input_datetime : { $exists : true } }
		);
		cursor.each(function(err, doc) {
			console.log('each');
			assert.equal(err, null);
			if (doc != null) {
				 res.send(doc);
			} else {
				 callback();
			}
		});
	};

	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  findRecords(db, function() {
	      db.close();
	  });
	});
};

module.exports = record;
