//http://mongodb.github.io/node-mongodb-native/3.0/quick-start/quick-start/

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'ServiceDb';

// Database connection
let db = null;

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db = client.db(dbName);
});


/*
//Users Schema

{
	name: String,
	email: String,
	password: String,
	interests: [String/int/enum],
	phone: String,
	eventsAttending: [int],
	eventsHosting:[int]
}
*/

module.exports.getUser = function(username){
	return new Promise(	
		function (resolve, reject) {
			const collection = db.collection('Users');
			// Find some documents
			
			let query = {'name': name} ;
			console.log(query);

		 	let dbRes = collection.findOne(query, (function(err, docs) {
			if(err == null){
				console.log("getUser() query Success");
				resolve(doc);
			} else{
				console.log("getUser() query Failed");
				reject(error);
			}
		});
	});
};

module.exports.addUser = function(name, email, password){
	return new Promise(	
		function (resolve, reject) {
			const collection = db.collection('Posts');
			let doc = {'name': name, 'email': email, 'password': password}
		 	collection.insertOne(doc,{},function(err, result) {
			if(err == null){
				console.log("addUser() query Success: " + name);
				resolve(result);
			} else{
				console.log("addUser() query failed: " + name);
				reject(error);
			}
		});
	});
};


module.exports.updateUserPassword = function(name, password){
	return new Promise(	
		function (resolve, reject) {
			const collection = db.collection('Posts');
			let doc = {};
			doc.password = password;

		 	collection.updateOne({'name': name},{ '$set': doc}, {'upsert':false},function(err, result) {
			if(err == null){
				console.log("updateUserPassword() Success: " + name);
				resolve(result);
			} else{
				console.log("updateUserPassword() Failed: " + name);
				reject(error);
			}
		});
	});
};

module.exports.updateUserInterests = function(name, interestList){
	return new Promise(	
		function (resolve, reject) {
			const collection = db.collection('Posts');
			let doc = {};
			doc.interests = interestList;

		 	collection.updateOne({'name': name},{ '$set': doc}, {'upsert':false},function(err, result) {
			if(err == null){
				console.log("updateUserInterests() Success: " + name);
				resolve(result);
			} else{
				console.log("updateUserInterests() Failed: " + name);
				reject(error);
			}
		});
	});
};

/*
//Events Schema
{
	eventID: int
	title: String
	timeDate: Date
	tag:[String/int/enum],
	location: TBD
	locationName: String
	host: String (username)
	attendees: [String]
	reviews:[{score:Int, review:String}]
}
*/

module.exports.getAllEvents = function(){
	return new Promise(	
		function (resolve, reject) {
			const collection = db.collection('Events');
			// Find some documents
		 	let dbRes = collection.find({},{
				'attendees': 0, 
				'reviews': 0
			}).sort('timeDate',-1);
			dbRes.toArray((function(err, docs) {
			if(err == null){
				console.log("getAllEvents() query Success");
				resolve(doc);
			} else{
				console.log("getAllEvents() query Failed");
				reject(error);
			}
		});
	});
};

module.exports.getEventsInRange = function(upperBound, lowerBound, numberBound){
	return new Promise(	
		function (resolve, reject) {
			const collection = db.collection('Events');
			// Find some documents
			let doc = {'timeDate' : { '$lte': uBound,'$gte': lBound}};
		 	let dbRes = collection.find(doc).sort('timeDate',1);
			if (numberBound != null) {
				dbRes = dbRes.limit(numberBound);
			}
			dbRes.toArray((function(err, docs) {
			if(err == null){
				console.log("getAllEvents() query Success");
				resolve(doc);
			} else{
				console.log("getAllEvents() query Failed");
				reject(error);
			}
		});
	});
};







