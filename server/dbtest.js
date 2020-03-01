// DB Sanity Test
// Run by calling `node dbtest.js`
//Clean up db before rerunning

var dbInterface = require('./dbInterface');
var assert = require('assert');

setTimeout(function(){
    	console.log('startCalls');
    	let user = {
    		'name': 'a',
		'email': 'b',
		'password': 'c',
		'interests': [],
		'phone': '1234567891',
		'eventsAttending': [],
		'eventsHosting':[]
	}
	let u1 = dbInterface.addUser(user.name, user.email, user.password, user.phone).then(f =>{
	 	dbInterface.getUser('a').then(r => {
			delete r._id
			assert.deepEqual(r, user);
		});
	});

    	let u2 = u1.then( f => dbInterface.updateUserPassword(user.name , 'a').then(f =>{
 		dbInterface.getUser('a').then(r => {
			assert.equal(r.password, 'a');
			assert.equal(r.phone, user.phone);
		});
	}));
	

    	let u3 = u2.then( f => dbInterface.updateUserDetails(user.name, ['a'], user.phone))
		.then(f => dbInterface.addUserAttendingEvent(user.name, 1))	
		.then(f => dbInterface.addUserHostingEvent(user.name, 2))
		.then(r => dbInterface.getUser('a'))
		.then(r => {
			assert.equal(r.interests[0], 'a');
			assert.equal(r.interests.length, 1);
			assert.equal(r.phone, user.phone);
			assert.equal(r.eventsAttending[0], 1);
			assert.equal(r.eventsAttending.length, 1);
			assert.equal(r.eventsHosting[0], 2);
			assert.equal(r.eventsHosting.length, 1);
    	});
    	let u4 = u3.then(f => dbInterface.removeUserAttendingEvent(user.name, 1))	
		.then(f => dbInterface.removeUserHostingEvent(user.name, 2))
		.then(r => dbInterface.getUser('a'))
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
		'host': 'h',
		'attendees': [],
		'reviews':[]
   	 };
    	let newEvent = {
		'title': 'bar',
		'timeDate' : new Date(),
		'tag': ['tag'],
		'location': 'loc',
		'locationName': 'locName',
		'type' : 'tag',
		'host': 'h',
		'attendees': ['a'],
		'reviews':[{'user': 'a','score': 2,'review': 'c'}]
    	};

    	let e1 = dbInterface.addEvent(event.title, event.timeDate, event.tag, event.location,event.locationName, event.type, event.host);
    	let e2 = e1.then( f => dbInterface.getAllEvents())
		.then( r =>{
			let res = r[0];
			event.eventID = res._id;
			newEvent.eventID = res._id;
			assert.equal(res.title, event.title);
			assert.equal(res.timeDate.getTime(), event.timeDate.getTime());
			assert.equal(res.tag[0], event.tag[0]);
			assert.equal(res.location, event.location);
			assert.equal(res.locationName, event.locationName);
			assert.equal(res.host, event.host);
			assert.equal(res.attendees.length, 0);
			assert.equal(res.reviews.length, 0);

    	});
    	let e3 = e2.then( f => dbInterface.queryEvents())
		.then(r => {
			let res = r[0];
			assert.equal(res.title, event.title);
			assert.equal(res.timeDate.getTime(), event.timeDate.getTime());
			assert.equal(res.tag[0], event.tag[0]);
			assert.equal(res.location, event.location);
			assert.equal(res.locationName, event.locationName);
			assert.equal(res.host, event.host);
			assert.equal(res.attendees.length, 0);
			assert.equal(res.reviews.length, 0);
    	});
    	let e4 = e3.then( f => dbInterface.getEvent(event.eventID))
		.then(r => {
			let res = r;
			assert.equal(res.title, event.title);
			assert.equal(res.timeDate.getTime(), event.timeDate.getTime());
			assert.equal(res.tag[0], event.tag[0]);
			assert.equal(res.location, event.location);
			assert.equal(res.locationName, event.locationName);
			assert.equal(res.host, event.host);
			assert.equal(res.attendees.length, 0);
			assert.equal(res.reviews.length, 0);
    	});

    	let e5 = e4.then(f => dbInterface.updateEvent(newEvent.eventID , newEvent.title, newEvent.timeDate, newEvent.tag, newEvent.location, newEvent.locationName, newEvent.type))
		.then(r => dbInterface.addEventAttendee(newEvent.eventID, newEvent.attendees[0]))
		.then(r => dbInterface.addEventReview(newEvent.eventID, newEvent.reviews[0].user, newEvent.reviews[0].score,newEvent.reviews[0].review))
		.then(r => dbInterface.getEvent(newEvent.eventID))
		.then(r => {
			assert.equal(r.title, newEvent.title);
			assert.equal(r.timeDate.getTime(), newEvent.timeDate.getTime());
			assert.equal(r.tag[0], newEvent.tag[0]);
			assert.equal(r.location, newEvent.location);
			assert.equal(r.locationName, newEvent.locationName);
			assert.equal(r.attendees[0], newEvent.attendees[0]);
			assert.deepEqual(r.reviews[0], newEvent.reviews[0]);
    	});
	let e6 = e5.then(r => dbInterface.removeEventAttendee(newEvent.eventID, newEvent.attendees[0]))
		.then(r => dbInterface.getEvent(newEvent.eventID))
		.then(r => {
			assert.equal(r.attendees.length, 0);
	});
   	console.log('endCalls');
}, 2000);
