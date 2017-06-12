#!/usr/bin/env node

var MongoClient = require('mongodb').MongoClient;

var mongoUri = 'mongodb://localhost/AccessControl20';

MongoClient.connect(mongoUri, function(err, db) {
  if (err) {
    console.log('could not connect to database: ' + mongoUri);
    process.exit(-1);
  }

  db.collection('record').remove({}, function(err, result){
    if(err) {
      console.error('Error' + err);
      process.exit(1)
    }

    console.log('Register collection has been droped succesfully.');

    db.close();
  })
})
