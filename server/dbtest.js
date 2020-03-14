// DB Sanity Test
// Run by calling `node dbtest.js`
//Clean up db before rerunning

var dbInterface = require('./dbInterface');
var assert = require('assert');
const {ObjectId} = require('mongodb'); 
setTimeout(function(){
    	console.log('startCalls');
    	let user = {
    		'name': 'a',
		'email': 'b',
		'password': 'c',
		'phone': '1234567891',
		'eventsAttending': [],
		'eventsHosting':[]
	}
	let u1 = dbInterface.addUser(user.name, user.email, user.password, user.phone).then(f =>{
	 	dbInterface.getUser(user.email).then(r => {
			delete r._id
			assert.deepEqual(r, user);
		});
	});

    	let u2 = u1.then( f => dbInterface.updateUserPassword(user.email , 'a').then(f =>{
 		dbInterface.getUser(user.email).then(r => {
			assert.equal(r.password, 'a');
			assert.equal(r.phone, user.phone);
		});
	}));
	

    	let u3 = u2.then( f => dbInterface.updateUserDetails(user.email, user.phone))
		.then(f => dbInterface.addUserAttendingEvent(user.email, 1))	
		.then(f => dbInterface.addUserHostingEvent(user.email, 2))
		.then(r => dbInterface.getUser(user.email))
		.then(r => {
			assert.equal(r.phone, user.phone);
			assert.equal(r.eventsAttending[0], 1);
			assert.equal(r.eventsAttending.length, 1);
			assert.equal(r.eventsHosting[0], 2);
			assert.equal(r.eventsHosting.length, 1);
    	});
    	let u4 = u3.then(f => dbInterface.removeUserAttendingEvent(user.email, 1))	
		.then(f => dbInterface.removeUserHostingEvent(user.email, 2))
		.then(r => dbInterface.getUser(user.email))
		.then(r => {
			assert.equal(r.eventsAttending.length, 0);
			assert.equal(r.eventsHosting.length, 0);
    	});

    	let event = {
		'title': 'foo',
		'timeDate' : new Date(),
		'tag': ['tag'],
		'location': 'loc',
		'locationName': 'locNAme',
		'type': 'tag',
		'host': {'email' :'h'},
		'attendees': [],
		'reviews':[],
		'description': 'description'
   	 };
    	let newEvent = {
		'title': 'bar',
		'timeDate' : new Date(),
		'tag': ['tag'],
		'location': 'loc',
		'locationName': 'locName',
		'type' : 'tag',
		'host': {'email' :'h'},
		'attendees': [{"_id": ObjectId().toHexString()}],
		'reviews':[{'user': 'a','score': 2,'review': 'c'}],
		'description': 'newdescription'
    	};

    	let e1 = dbInterface.addEvent(event.title, event.timeDate, event.location,event.locationName, event.type, event.host, event.description);
    	let e2 = e1.then( f => dbInterface.getAllEvents())
		.then( r =>{
			let res = r[0];
			event.eventID = res._id;
			newEvent.eventID = res._id;
			assert.equal(res.title, event.title);
			assert.equal(res.timeDate.getTime(), event.timeDate.getTime());
			assert.equal(res.type, event.type);
			assert.equal(res.location, event.location);
			assert.equal(res.locationName, event.locationName);
			assert.deepEqual(res.host.email, event.host.email);
			assert.equal(res.description, event.description);
			assert.equal(res.attendees.length, 0);
			assert.equal(res.reviews.length, 0);

    	});
    	let e3 = e2.then( f => dbInterface.queryEvents())
		.then(r => {
			let res = r[0];
			assert.equal(res.title, event.title);
			assert.equal(res.timeDate.getTime(), event.timeDate.getTime());
			assert.equal(res.type, event.type);
			assert.equal(res.location, event.location);
			assert.equal(res.locationName, event.locationName);
			assert.deepEqual(res.host.email, event.host.email);
			assert.equal(res.description, event.description);
			assert.equal(res.attendees.length, 0);
			assert.equal(res.reviews.length, 0);
    	});
    	let e4 = e3.then( f => dbInterface.getEvent(event.eventID))
		.then(r => {
			let res = r;
			assert.equal(res.title, event.title);
			assert.equal(res.timeDate.getTime(), event.timeDate.getTime());
			assert.equal(res.type, event.type);
			assert.equal(res.location, event.location);
			assert.equal(res.locationName, event.locationName);
			assert.deepEqual(res.host.email, event.host.email);
			assert.equal(res.description, event.description);
			assert.equal(res.attendees.length, 0);
			assert.equal(res.reviews.length, 0);
    	});

    	let e5 = e4.then(f => dbInterface.updateEvent(newEvent.eventID , newEvent.title, newEvent.timeDate, newEvent.location, newEvent.locationName, newEvent.type, newEvent.description))
		.then(r => dbInterface.addEventAttendee(newEvent.eventID, newEvent.attendees[0]))
		.then(r => dbInterface.addEventReview(newEvent.eventID, newEvent.reviews[0].user, newEvent.reviews[0].score,newEvent.reviews[0].review))
		.then(r => dbInterface.getEvent(newEvent.eventID))
		.then(r => {
			assert.equal(r.title, newEvent.title);
			assert.equal(r.timeDate.getTime(), newEvent.timeDate.getTime());
			assert.equal(r.type, newEvent.type);
			assert.equal(r.location, newEvent.location);
			assert.equal(r.locationName, newEvent.locationName);
			assert.equal(r.description, newEvent.description);
			assert.deepEqual(r.attendees[0], newEvent.attendees[0]);
			assert.deepEqual(r.reviews[0], newEvent.reviews[0]);
    	});
	let e6 = e5.then(r => dbInterface.removeEventAttendee(newEvent.eventID, newEvent.attendees[0]._id))
		.then(r => dbInterface.getEvent(newEvent.eventID))
		.then(r => {
			assert.equal(r.attendees.length, 0);
	});
	let e7 = e6.then(r => dbInterface.getHostAvgRating(event.host.email))
		.then( r => assert.equal(newEvent.reviews[0].score, r.result));

	let e8 = e7.then(r => dbInterface.removeEvent(newEvent.eventID))
		.then( f => dbInterface.getAllEvents())
		.then( r => assert.equal(r.length, 0))
   	console.log('endCalls');
}, 2000);
