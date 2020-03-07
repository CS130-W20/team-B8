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

  socket.on('getUser', (email) => {
    let prom = dbInterface.getUser(email);
    prom.then( (docs) => {
      console.log("FOUND USER", docs);
      let prom2 = dbInterface.getHostAvgRating(docs.email);
      prom2.then(avg_score => {
        console.log("FOUND USER", docs);
        docs['avgScore'] = avg_score;
        socket.emit("getUserReply", docs);
      }
      ).catch( err => reject(err));
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

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

  socket.on('addEvent', (title, date, tag, location, locationName, type, host) => {
    let prom = dbInterface.addEvent(title, date, tag, location, locationName, type, host);
    prom.then( (docs) => {
      console.log("NEW EVENT", docs);
      socket.emit("addEventReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  socket.on('updateEvent', (eventID, title, timeDate, tag, location, locationName, type, description) => {
    let prom = dbInterface.updateEvent(eventID, title, timeDate, tag, location, locationName, type, description);
    prom.then( (docs) => {
      console.log("EVENT UPDATED", docs);
      socket.emit("updateEventReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  socket.on('addEventAttendee', (eventID, attendee) => {
    //TODO: does the db call overwrite with one attendee or append?
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
