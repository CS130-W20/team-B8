const http = require('http');
var dbInterface = require('./dbInterface');
const express = require('express');
const app = express();
const server= require('http').Server(app);
const io = require('socket.io')(server);
const twilio = require('twilio');
const ProxySMSMessage = require('./ProxySMSMessage');
const authToken = require('./authToken');

// TODO: add rooms so not ever user will see everyone's events

/**
  * SET UP SOCKET
  */
server.listen(8000, ()=> {
  console.log('Server for Bruin-Meet listening on port 8000!')
});

/**
  * DATABASE FUNCTIONS FOR PROMISES
  */
  function successCallback(result) {
    console.log("Successful interaction: " + result);
  }
  function failureCallback(error) {
  console.error("ERROR interacting with mdb " + error);
}

/**
  * SOCKET EVENT INTERACTIONS
  @param: socket : socket.io object to generate socket connection
  */
io.on("connection", (socket) => {
    //handshake with client
    console.log("Server connected to socket!");
    socket.on('test' , (msg) => {
    socket.emit('serverReply', "SERVER: Hello, Client!");
    console.log(msg);
  })

  /**
  Add a new user to the "Users" collection in the DB.
  Other event listeners are similar to this.
  @param email: str user email
  @param password: str user password
  @return "authReply" event. returns update status, email, and token
  */
  socket.on('authenticate', (email, password) => {
    let prom = dbInterface.getUser(email);
    prom.then( (docs) => {
      console.log("FOUND USER", docs);
      if (docs == null) {
        //no user with that username
        socket.emit("authReply", "FAIL", docs["email"], "");
      }
      else {
        // found a user
        console.log("USER FOUND: ", docs);
        console.log("Entered password: ", password);
        if (docs["password"] == password) {
          // correct password
          // client needs to store generated token
	        docs['token'] = authToken.generateToken(email);
          socket.emit("authReply", "SUCCESS", docs["email"], docs["token"]);
        }
        else {
          //incorrect pass
          socket.emit("authReply", "FAIL", docs["email"], "");
        }
      }

    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("authReply", "FAIL")
    })
  })


  /**
   * authenticateToken function.
   @param: token. takes authentication token
   @return: "authTokenReply" response: {"FAIL", "TRUE"}
   */
  socket.on('authenticateToken', (token) => {
    content = authToken.decode(token);
    if (content.isValid == false){
	socket.emit("authTokenReply", "FAIL", null);
    }
    let prom = dbInterface.getUser(content.name);
    prom.then( (docs) => {
      console.log("FOUND USER", docs);
      if (docs == null) {
        //no user with that username
        socket.emit("authTokenReply", "FAIL", docs["email"]);
      }
      else {
        // found a user
        console.log("USER FOUND: ", docs);
	      docs['token'] = authToken.generateToken(username);
        socket.emit("authTokenReply", "SUCCESS", docs["email"]);
      }

    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("authTokenReply", "FAIL")
    })
  })


  /**
   * addUser function
   @param name: str. user's name
   @paramm email: str. user's email
   @param password: str. user's password
   @param phone: str. user's phone number
   @return "addUserReply" or "serverError" event emit. returns mongoDB obj or err
   */
  socket.on('addUser', (name, email, password, phone) => {
    console.log("on add user", name, email, password, phone);
    //on the "addUser" socket event, recieve the tuple and request the promise:
    let prom = dbInterface.addUser(name, email, password, phone);
    //Promise flow
    prom.then( (docs) => {
      // if promise is resolved
      console.log("USER ADDED", docs);
      socket.emit("addUserReply", docs);
    })
    .catch( (error) =>  {
      // if promise is rejected
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  /**
   * getUser function.
   @param email: user's email that you wish to retrieve
   @return: "getUserReply" or "getUserError" event emitted. Either user mongo
   object or error
   */
  socket.on('getUser', (email) => {
    let prom = dbInterface.getUser(email);
    prom.then( (docs) => {
      console.log("FOUND USER", docs);
      let prom2 = dbInterface.getHostAvgRating(docs.email);
      prom2.then(doc => {
        console.log("FOUND USER", docs);
        docs['avgScore'] = doc.result;
        docs['reviews'] = doc.reviews;
        socket.emit("getUserReply", docs);
      }
      ).catch( err => reject(err));
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("getUserError", error)
    })
  });

  /**
   * getHost function
   @param email: str. host's email that you wish to retrieve
   @return "getHostReply" or "serverError" error. user mongodb object or error
   */
  socket.on('getHost', (email) => {
    let prom = dbInterface.getUser(email);
    prom.then( (docs) => {
      console.log("FOUND HOST", docs);
      let prom2 = dbInterface.getHostAvgRating(docs.email);
      prom2.then(doc => {
        console.log("FOUND REVIEWS", doc);
        if (Object.keys(doc).length > 0) {
          docs['avgScore'] = doc.result;
          docs['reviews'] = doc.reviews;
        }
        socket.emit("getHostReply", docs);
      }
      ).catch( err => reject(err));
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  });

  /**
   * updateUserPassword function.
   @param email: str. user's email (the user that you wish to update)
   @param newpass: str. the new password
   @return: "updateUserPasswordReply" or "serverError" events. returns newUser
   mongo object (updated) or error obj
   */
  socket.on('updateUserPassword', (email, newpass) => {
    let prom = dbInterface.updateUserPassword(email, newpass);
    prom.then( (docs) => {
      console.log("USER UPDATED", docs);
      socket.emit("updateUserPasswordReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  /**
   * updateUserInterests
   @param email: str. user's email
   @param interestList. [string]. list of interests (str)
   @param phone: str. user's phone number
   @return: "updateUserInterestsReply" or "serverError" events emitted.
   either updated mongodb user object or error obj
   */
  socket.on('updateUserInterests', (email, interestList, phone) => {
    let prom = dbInterface.updateUserDetails(email, interestList, phone);
    prom.then( (docs) => {
      console.log("USER INTERESTS UPDATED", docs);
      socket.emit("updateUserInterestsReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  /**
   * @param email: str. user's email
   @param eventId: str. event mongodb ID as a string.
   @return: "addUserAttendingEventReply" or "serverError" emit event. either
   event mongodb object or error
   */
  socket.on('addUserAttendingEvent', (email, eventId) => {
    let prom = dbInterface.addUserAttendingEvent(email, eventId);
    prom.then( (docs) => {
      console.log("USER ATTENDING NEW EVENT", docs);
      socket.emit("addUserAttendingEventReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  /**
   * Remove user from event
   @param email: str. user's email.
   @param eventId: str. event mongodb Id
   @return "removeUserAttendingEventRelpy" or "serverError" events emitted.
   returns event mongodb objet or err obj
   */
  socket.on('removeUserAttendingEvent', (email, eventId) => {
    let prom = dbInterface.removeUserAttendingEvent(email, eventId);
    prom.then( (docs) => {
      console.log("USER NO LONGER ATTENDING", docs);
      socket.emit("removeUserAttendingEventReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  /**
   * add an event to a user's "hosting" list
   @param email: str. host's email
   @param eventId: str. new event's mognodb event Id
   @return: "addUserHostingEventReply" or "serverError" events emitted with
   respective event obj or error obj
   */
  socket.on('addUserHostingEvent', (email, eventId) => {
    let prom = dbInterface.addUserHostingEvent(email, eventId);
    prom.then( (docs) => {
      console.log("ADDED HOST EVENT", docs);
      socket.emit("addUserHostingEventReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  /**
   * Remove a user's hosted event
   @param email: str. host's email
   @param eventId: str. mongodb event id
   @return "removeUserHostingEventReply" or "serverError" events emitted. Returns
   updated host user mongodb object or error
   */
  socket.on('removeUserHostingEvent', (email, eventId) => {
    let prom = dbInterface.removeUserHostingEvent(email, eventId);
    prom.then( (docs) => {
      console.log("HOST REMOVED", docs);
      socket.emit("removeUserHostingEventReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  /**
   * retrieve all event objects from mongodb
   @return: "getAllEventsReply" list of mongodb event objects (JSON)
   or "serverError" error obj.
   */
  socket.on('getAllEvents', () => {
    let prom = dbInterface.getAllEvents();
    prom.then( (docs) => {
      console.log("EVENTS:", docs);
      socket.emit("getAllEventsReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  /**
   * Searches for events based on regex, tags, bounds, or eventIDs
   @param keywordRegex: str. regular expression
   @param tags: str. list of tags
   @param upperBound: Date() object. LATEST date to search
   @param lowerBound: Date() object. EARLIEST date to search
   @param numberBound: int. limit number of events to be returned
   @param eventIds: [string]. EventIds to query for.
   @return "queryEventsIDReply" or "serverError" with a list of events or
   error obj
   */
  socket.on('queryEvents', (keywordRegex, tags, upperBound, lowerBound, numberBound, eventIDs) => {
    if (eventIDs != null && eventIDs.length == 0) {
        console.log("NO EVENTS");
        socket.emit("queryEventsIDReply", []);
    } else {
      let prom = dbInterface.queryEvents(keywordRegex, tags, upperBound, lowerBound, numberBound, eventIDs);
      prom.then( (docs) => {
        console.log("EVENTS", docs);
        if (eventIDs != null) {
          socket.emit("queryEventsIDReply", docs);
        } else {
          socket.emit("queryEventsReply", docs);
        }
      })
      .catch( (error) =>  {
        console.log("ERROR:", error);
        socket.emit("serverError", error)
      })
    }
  })

  /**
   * Get event by eventId
   @param: eventId str. mongodb eventId
   @return: "getEventReply" or "serverError" event emitted. event mongodb object
   (JSON) or error obj.
   */
  socket.on('getEvent', (eventId) => {
    let prom = dbInterface.getEvent(eventId);
    prom.then( (docs) => {
      console.log("EVENT", docs);
      socket.emit("getEventReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  /**
   * Remove event (delete)
   @param eventId: str. mongo eventId of event to be deleted
   @return "removeEventReply" or "serverError" events emitted. mongodb JSOn reply
   or error obj.
   */
  socket.on('removeEvent', (eventId) => {
    let prom = dbInterface.removeEvent(eventId);
    prom.then( (docs) => {
      console.log("EVENT", docs);
      socket.emit("removeEventReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })


  /**
   * get events hosted by a user
   @param host: str. host's email
   @return: getEventsReply event emit. list of mongodb  event objects or error
   */
  socket.on('getEvents', (host) => {
    let prom = dbInterface.getEventByHost(host);
    prom.then( (docs) => {
      console.log("EVENTS", docs);
      socket.emit("getEventsReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  /**
   * get all events that a specific user has attended
   @param user: str. of username
   @return: "getAttendedEventsReply" event. list of mongodb event objects or
   "serverError" event
   */
  socket.on('getAttendedEvents', (user) => {
    let prom = dbInterface.getAllEvents();
    prom.then( (docs) => {
      var attended = docs.filter(event => event.attendees.indexOf(user) >= 0);
      console.log("ATTENDED EVENTS:", attended);
      socket.emit("getAttendedEventsReply", attended);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  /**
   * create new event
   @param title: str. title of event
   @param date: Date() object of event date
   @loocation: location string from google maps api
   @locationName: str. location description
   @type: str. type of event
   @host: str. host name
   @description: str. descr. of event
   @return: "addEventReply" event emitted. mognodb event object or "serverError"
   */
  socket.on('addEvent', (title, date, location, locationName, type, host, description) => {
    let prom = dbInterface.addEvent(title, date, location, locationName, type, host, description);
    prom.then( (docs) => {
      console.log("NEW EVENT", docs);
      socket.emit("addEventReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

/**
 * update event with new information
 @param eventId: str of mongoid of event to be updated
 @param title: str. new title of event
 @param timeDate: Date() obj. new date of event
 @param location: location string from maps api.
 @locationName: str. location description
 @type: str. type of event
 @host: str. host name
 @description: str. descr. of event
 @return: "updateEventReply" doc of updated mongo event object or "serverError"
 */
  socket.on('updateEvent', (eventID, title, timeDate, location, locationName, type, description) => {
    let prom = dbInterface.updateEvent(eventID, title, timeDate, location, locationName, type, description);
    prom.then( (docs) => {
      console.log("EVENT UPDATED", docs);
      socket.emit("updateEventReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  /**
   * add an attendee to an event
   @param eventId: str of event mongo id obj
   @param attendee: str. name of user
   return "addEventAttendeeReply" with new event obj. or "serverError"
   */
  socket.on('addEventAttendee', (eventID, attendee) => {
    let prom = dbInterface.addEventAttendee(eventID, attendee);
    prom.then( (docs) => {
      console.log("NEW ATTENDEE", docs);
      socket.emit("addEventAttendeeReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  /**
   * remove an attendee to an event
   @param eventId: str of event mongo id obj
   @param attendee: str. name of user
   return "removeEventAttendeeReply" with new event obj. or "serverError"
   */
  socket.on('removeEventAttendee', (eventID, attendee) => {
    let prom = dbInterface.removeEventAttendee(eventID, attendee);
    prom.then( (docs) => {
      console.log("REMOVED ATTENDEE", docs);
      socket.emit("removeEventAttendeeReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

/**
 * add event review from a user
 @param eventID: str mongo id of event
 @param user: str. username of user leaving the review
 @param score: str. score of review
 @param review; Str. review text
 @return "addEventReply" event with upated event with new review added or
 "serverError"
 */
  socket.on('addEventReview', (eventID, user, score, review) => {
    let prom = dbInterface.addEventReview(eventID, user, score, review);
    prom.then( (docs) => {
      console.log("REVIEW ADDED", docs);
      socket.emit("addEventReviewReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  /**
   * add an image to an event's thumbnail
   @param eventID; str. mongodb id for event
   @param imageArrayBuffer: ArrayBuffer() or Buffer() objects representing image
   @return "serverReply" or "serverError" events returning mongodb event obj
   */
  socket.on('addImage', (eventID, imageArrayBuffer) => {
    let prom = dbInterface.addImage(eventID, imageArrayBuffer);
    prom.then( (docs) => {
      console.log("IMAGE ADDED", docs);
      socket.emit("serverReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  /**
   * Remove image that has been previously added to an event
   @param eventID: str mongodb id
   @reply "serverReply" or "serverError" with updated mongo event obj
   */
  socket.on('removeImage', (eventID) => {
    let prom = dbInterface.addImage(eventID);
    prom.then( (docs) => {
      console.log("IMAGE REMOVED", docs);
      socket.emit("serverReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  socket.on('messageUsers', (req, event) => {
    let smsMsg = new ProxySMSMessage(req, event);
    try {
      smsMsg.send();
      console.log("serverReply", "Successfully sent to all recipients!")
      socket.emit("messageUsersReply", "Successfully sent to all recipients!")
    } catch (error) {
      console.log("ERROR:", error);
      socket.emit("serverError", error);
    }
  });
});
