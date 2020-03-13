//http://mongodb.github.io/node-mongodb-native/3.0/quick-start/quick-start/

const MongoClient = require('mongodb').MongoClient;
const {ObjectId} = require('mongodb'); // or ObjectID
const {Binary} = require('mongodb');
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'ServiceDb';

// Database connection
let db = null;

/ Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db = client.db(dbName);
});


/**
 * Gets a user's information
 * @param {string} email
 * @returns {Promise} Promise object representing user
 */
module.exports.getUser = function(email){
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Users');
			// Find some documents

			let query = {'email': email} ;
			console.log(query);

		 	collection.findOne(query, function(err, doc) {
			if(err == null){
				console.log("getUser() query Success");
				resolve(doc);
			} else{
				console.log("getUser() query Failed");
				reject(err);
			}
		});
	});
};

/**
 * Adds a User to the database
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 * @param {string} phone 
 * @returns {Promise} Promise object representing completion of adding the user
 */

module.exports.addUser = function(name, email, password, phone){
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Users');
			let doc = {
				'name': name,
				'email': email,
				'password': password,
				'phone': phone,
				'eventsAttending': [],
				'eventsHosting':[]
			}
		 	collection.insertOne(doc,{},function(err, result) {
			if(err == null){
				console.log("addUser() query Success: " + email);
				resolve(result);
			} else{
				console.log("addUser() query failed: " + email);
				reject(err);
			}
		});
	});
};

/**
 * Replaces a user's password
 * @param {string} email - User's email
 * @param {string} password - new password to replace old password
 * @returns {Promise} Promise object representing completion of password change
 */

module.exports.updateUserPassword = function(email, password){
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Users');
			let doc = {};
			doc.password = password;

		 	collection.updateOne({'email': email},{ '$set': doc}, {'upsert':false},function(err, result) {
			if(err == null){
				console.log("updateUserPassword() Success: " + email);
				resolve(result);
			} else{
				console.log("updateUserPassword() Failed: " + email);
				reject(err);
			}
		});
	});
};

/**
 * Updates a user's information
 * @param {string} name 
 * @param {string} phone 
 * @returns {Promise} Promise object representing completion of update
 */
module.exports.updateUserDetails = function(email, phone){
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Users');
			let doc = {};
			doc.phone = phone;

		 	collection.updateOne({'email': email},{ '$set': doc}, {'upsert':false},function(err, result) {
			if(err == null){
				console.log("updateUserDetails() Success: " + email);
				resolve(result);
			} else{
				console.log("updateUserDetailss() Failed: " + email);
				reject(err);
			}
		});
	});
};

/**
 * Adds a event to the list of event a User attends
 * @param {string} email
 * @param {string} eventID
 * @returns {Promise} Promise object representing completion of update
 */
module.exports.addUserAttendingEvent = function(email, eventID){
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Users');
			let doc = {
				'eventsAttending': eventID
			};
		 	collection.updateOne({'email': email},{ '$push': doc},
		 			{'upsert':false},function(err, result) {
			if(err == null){
				console.log("addUserAttendingEvent() Success: "
				+ email
				+ ":" + eventID);
				resolve(result);
			} else{
				console.log("addUserAttendingEvent() Failed: "
				+ email
				+ ":" + eventID);
				reject(err);
			}
		});
	});
};

/**
 * Removes a event to the list of event a User attends
 * @param {string} name 
 * @param {string} eventID
 * @returns {Promise} Promise object representing completion of update
 */
module.exports.removeUserAttendingEvent = function(email, eventID){
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Users');
			let doc = {
				'eventsAttending': eventID
			};
		 	collection.updateOne({'email': email},{ '$pull': doc},
		 			{'upsert':false},function(err, result) {
			if(err == null){
				console.log("removeUserAttendingEvent() Success: "
				+ email
				+ ":" + eventID);
				resolve(result);
			} else{
				console.log("removeUserAttendingEvent() Failed: "
				+ email
				+ ":" + eventID);
				reject(err);
			}
		});
	});
};

/**
 * Adds a event to the list of event a User is hosting
 * @param {string} email 
 * @param {string} eventID
 * @returns {Promise} Promise object representing completion of update
 */
module.exports.addUserHostingEvent = function(email, eventID){
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Users');
			let doc = {
				'eventsHosting': eventID
			};
		 	collection.updateOne({'email': email},{ '$push': doc},
		 			{'upsert':false},function(err, result) {
			if(err == null){
				console.log("addUserHostingEvent() Success: "
				+ email
				+ ":" + eventID);
				resolve(result);
			} else{
				console.log("addUserHostingEvent() Failed: "
				+ email
				+ ":" + eventID);
				reject(err);
			}
		});
	});
};
/**
 * Removes a event to the list of event a User is hosting
 * @param {string} email 
 * @param {string} eventID
 * @returns {Promise} Promise object representing completion of update
 */
module.exports.removeUserHostingEvent = function(email, eventID){
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Users');
			let doc = {
				'eventsHosting': eventID
			};
		 	collection.updateOne({'email': email},{ '$pull': doc},
		 			{'upsert':false},function(err, result) {
			if(err == null){
				console.log("removeUserHostingEvent() Success: "
				+ email
				+ ":" + eventID);
				resolve(result);
			} else{
				console.log("removeUserHostingEvent() Failed: "
				+ email
				+ ":" + eventID);
				reject(err);
			}
		});
	});
};

/**
Events Schema
{
	eventID: int
	title: String
	description: String
	timeDate: Date
	location: TBD
	locationName: String
	type: String
	host: String (username)
	attendees: [String]
	reviews:[{user: String, score:Int, review:String}]
}
*/

/**
 * Gets all events in database
 * @returns {Promise} Promise object representing array of all existing events
 */

module.exports.getAllEvents = function(){
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Events');
			// Find some documents
		 	let dbRes = collection.find({},{
				'attendees': 0,
				'reviews': 0,
				'image': 0
			}).sort('timeDate',-1);
			dbRes.toArray(function(err, docs) {
			if(err == null){
				console.log("getAllEvents() query Success");
				resolve(docs);
			} else{
				console.log("getAllEvents() query Failed");
				reject(err);
			}
		});
	});
};

/**
 * Queries for events meeting search criteria. Unused parameters can be set to null.
 * @param {RegExp} keywordRegex - regex to search title of event
 * @param {Array} tags - event type tags to filter out
 * @param {Date} upperBound - Find all events before the given date
 * @param {Date} lowerBound - Find all events after the given date
 * @param {number} numberBound - Limit the number of events queried
 * @param {Array.string} eventIDs - specific eventIDs
 * @returns {Promise} Promise object representing result of query. Results are sorted in ascending timeDate order.
 */
module.exports.queryEvents = function(keywordRegex, tags, upperBound, lowerBound, numberBound, eventIDs){
	// keywordRegex is a RegExp Obj corresponding to the keywords
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Events');
			let doc = {};
			let IDList = [];
			if (keywordRegex != null) {
				doc['title'] = keywordRegex;
			}
			if (tags != null && tags.length !=0) {
				doc['tag'] = {'$in': tags};
			}

			let dateRange = {};
			if (upperBound != null) {
				dateRange['$lte'] = upperBound;
			}
			if (lowerBound != null) {
				dateRange['$gt'] = lowerBound;
			}
			if (Object.keys(dateRange).length != 0) {
				doc['timeDate'] = dateRange;
			}
			if (eventIDs != null && eventIDs.length != 0) {
				eventIDs.forEach(ID => {
					console.log(ID);
					IDList.push(ObjectId(ID));
				})
				doc['_id'] = {'$in': IDList };
			}
		 	let dbRes = collection.find(doc,{
				'attendees': 0,
				'reviews': 0,
				'image': 0
			}).sort('timeDate',1);
			if (numberBound != null) {
				dbRes = dbRes.limit(numberBound);
			}
			dbRes.toArray(function(err, doc) {
			if(err == null){
				console.log("queryEvents() query Success");
				resolve(doc);
			} else{
				console.log("queryEvents() query Failed");
				reject(err);
			}
			IDList = [];
		});
	});
};


/**
 * Gets a single event by eventID
 * @param {string} eventID
 * @returns {Promise} Promise object representing event
 */
module.exports.getEvent = function(eventID){
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Events');
			// Find some documents

			let query = {'_id': ObjectId(eventID)} ;
			console.log(query);

		 	collection.findOne(query, function(err, doc) {
			if(err == null){
				console.log("getEvent() query Success" + doc);
				resolve(doc);
			} else{
				console.log("getEvent() query Failed");
				reject(err);
			}
		});
	});
};

/**
 * Removes a single event by eventID
 * @param {string} eventID
 * @returns {Promise} Promise object representing success of removal
 */

module.exports.removeEvent = function(eventID){
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Events');
			// Find some documents

			let query = {'_id': ObjectId(eventID)} ;
			console.log(query);

		 	collection.removeOne(query, function(err, doc) {
			if(err == null){
				console.log("removeEvent() query Success" + doc);
				resolve(doc);
			} else{
				console.log("removeEvent() query Failed");
				reject(err);
			}
		});
	});
};

/**
 * Gets a single event by the user hosting it
 * @param {string} host - host's email
 * @param {Date} lowerBound - Find all events after than a certain date
 * @returns {Promise} Promise object representing array of all existing events
 */
module.exports.getEventByHost = function(host, lowerBound){
	return new Promise(
		function (resolve, reject) {
			console.log('host: ', host);
			const collection = db.collection('Events');
			let query = {'host.email': host};

			let dateRange = {};
			if (lowerBound != null) {
				dateRange['$gt'] = lowerBound;
			}
			if (Object.keys(dateRange).length != 0) {
				query['timeDate'] = dateRange;
			}

			collection.find(query,{
				'image': 0
			}).toArray(function(err, docs) {
				if(err == null){
					console.log("getEventByHost() query Success");
					resolve(docs);
				} else{
					console.log("getEventByHost() query Failed");
					reject(err);
				}
			})
		}
	)
}

/**
 * Returns the aggregate score of a host
 * @param {string} host - host email
 * @returns {Promise} Promise object representing the result
 */

module.exports.getHostAvgRating = function(host){
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Events');
			let query = {'host.email': host}
			let mat = {'$match' : query};
			let unw = {'$unwind' : "$reviews"};
			let group = {'$group' : {'_id' : '$host', 'reviews': {'$push':{'rating': '$reviews.score', 'review': '$reviews.review', 'user': '$reviews.user.name', 'event': '$title'}}, 'result' : {'$avg':'$reviews.score'}}};

			let agg_pipeline = [mat, unw, group];
			collection.aggregate(agg_pipeline).toArray(function(err, docs) {
				if(err == null){
					console.log("getHostAvgRating() query Success:" + docs);
					if(docs.length != 0){
						var docToSend = {};
						docToSend.result = docs.reduce((avg,doc) => (avg + doc.result/docs.length), 0);
						docToSend.reviews = docs.reduce((revs,doc) => revs.concat(doc.reviews), []);
						resolve(docToSend);
					}
					else 
						resolve(docs)
				} else{
					console.log("getHostAvgRating() query Failed");
					reject(err);
				}
			})
		}
	)
}


/**
 * Adds a new event to database
 * @param {string} title - Title of event
 * @param {Date} timeDate - Date of event
 * @param {Object} location - Google Maps location information
 * @param {string} locationName - name of location
 * @param {string} type - type of event
 * @param {string} host - host email
 * @param {string} description - description of event
 * @returns {Promise} Promise object representing success of update
 */
module.exports.addEvent = function(title, timeDate, location, locationName, type, host,description){
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Events');
			let doc = {
				'title': title,
				'timeDate': timeDate,
				'location': location,
				'locationName': locationName,
				'type': type,
				'host': host,
				'attendees': [],
				'reviews':[],
				'description': description
			};
		 	collection.insertOne(doc,{},function(err, result) {
			if(err == null){
				console.log("addEvent() query Success: " + title);
				resolve(doc._id);
			} else{
				console.log("addEvent() query failed: " + title);
				reject(err);
			}
		});
	});
};

/**
 * Updates information for a new event
 * @param {string} eventID - event id
 * @param {string} title - Title of event
 * @param {Date} timeDate - Date of event
 * @param {Object} location - Google Maps location information
 * @param {string} locationName - name of location
 * @param {string} type - type of event
 * @param {string} description - description of event
 * @returns {Promise} Promise object representing success of update
 */
module.exports.updateEvent = function(eventID, title, timeDate, location, locationName, type, description){
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Events');
			let doc = {
				'title': title,
				'timeDate': timeDate,
				'type': type,
				'location': location,
				'locationName': locationName,
				'description' :description
			};
		 	collection.updateOne({'_id': ObjectId(eventID)},{ '$set': doc},
		 			{'upsert':false},function(err, result) {
			if(err == null){
				console.log("updateEvent() Success: " + eventID);
				resolve(result);
			} else{
				console.log("updateEvent() Failed: " + eventID);
				reject(err);
			}
		});
	});
};

/**
 * Removes user from event's attendling lis
 * @param {string} eventID - event id
 * @param {string} attendee - User email
 * @returns {Promise} Promise object representing success of update
 */
module.exports.addEventAttendee = function(eventID, attendee){
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Events');
			let doc = {
				'attendees': attendee
			};
		 	collection.updateOne({'_id': ObjectId(eventID)},{ '$push': doc},
		 			{'upsert':false},function(err, result) {
			if(err == null){
				console.log("addEventAttendee() Success: " + result);
				resolve(result);
			} else{
				console.log("addEventAttendee() Failed: " + eventID);
				reject(err);
			}
		});
	});
};

/**
 * Removes user from event's attendling list
 * @param {string} eventID - event id
 * @param {string} attendee - User email
 * @returns {Promise} Promise object representing success of update
 */
module.exports.removeEventAttendee = function(eventID, attendeeID){
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Events');
			let doc = {
				'attendees': {'_id' : attendeeID}
			};
		 	collection.updateOne({'_id': ObjectId(eventID)},{ '$pull': doc},
		 			{'upsert':false},function(err, result) {
			if(err == null){
				console.log("removeEventAttendee() Success: " + eventID);
				resolve(result);
			} else{
				console.log("removeEventAttendee() Failed: " + eventID);
				reject(err);
			}
		});
	});
};


/**
 * Adds review for event
 * @param {string} eventID - event id
 * @param {string} user - User email
 * @param {Number} score - User's score for event
 * @param {review} score - User's descriptive review
 * @returns {Promise} Promise object representing success of update
 */
module.exports.addEventReview = function(eventID, user, score, review){
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Events');
			let doc = {
				'reviews':{
					'user': user,
					'score': score,
					'review': review
				}
			};
		 	collection.updateOne({'_id': ObjectId(eventID)},{ '$push': doc},
		 			{'upsert':false},function(err, result) {
			if(err == null){
				console.log("addEventReview() Success: " + eventID);
				resolve(result);
			} else{
				console.log("addEventReview() Failed: " + eventID);
				reject(err);
			}
		});
	});
};
/**
 * Adds image for event
 * @param {string} eventID - event id
 * @param {Object} imageArrayBuffer - ArrayBuffer or Buffer object representing image
 * @returns {Promise} Promise object representing success of update
 */
module.exports.addImage = function(eventID, imageArrayBuffer){
	
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Events');
			let doc = {'$set': {
				'image': Binary(Buffer.from(imageArrayBuffer))
			}};
		 	collection.updateOne({'_id': ObjectId(eventID)}, doc,
		 			{'upsert':false},function(err, result) {
			if(err == null){
				console.log("addImage() Success: " + eventID);
				resolve(result);
			} else{
				console.log("addImage() Failed: " + eventID);
				reject(err);
			}
		});
	});
};
/**
 * Remove image for event
 * @param {string} eventID - event id
 * @returns {Promise} Promise object representing success of update
 */
module.exports.removeImage = function(eventID){
	return new Promise(
		function (resolve, reject) {
			const collection = db.collection('Events');
			let doc = {
				'image': null
			};
		 	collection.updateOne({'_id': ObjectId(eventID)}, doc,
		 			{'upsert':false},function(err, result) {
			if(err == null){
				console.log("removeImage() Success: " + eventID);
				resolve(result);
			} else{
				console.log("Image() Failed: " + eventID);
				reject(err);
			}
		});
	});
};
