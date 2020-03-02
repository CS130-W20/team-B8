const http = require('http');
var dbInterface = require('./dbInterface');
const express = require('express');
const app = express();
const server= require('http').Server(app);
const io = require('socket.io')(server);
const twilio = require('twilio');
const ProxySMSMessage = require('./ProxySMSMessage');

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
  socket.on('addUser', (name, email, password, phone) => {
    //on the "addUser" socket event, recieve the tuple and request the promise:
    let prom = dbInterface.addUser(name, email, password, phone);
    //Promise flow
    prom.then( (docs) => {
      // if promise is resolved
      console.log("USER ADDED", docs);
      socket.emit("serverReply", docs);
    })
    .catch( (error) =>  {
      // if promise is rejected
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  socket.on('getUser', (name) => {
    let prom = dbInterface.getUser(name);
    prom.then( (docs) => {
      console.log("FOUND USER", docs);
      let prom2 = dbInterface.getHostAvgRating(docs.name);
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

  socket.on('updateUserPassword', (name, newpass) => {
    let prom = dbInterface.updateUserPassword(name, newpass);
    prom.then( (docs) => {
      console.log("USER UPDATED", docs);
      socket.emit("serverReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  socket.on('updateUserInterests', (name, interestList, phone) => {
    let prom = dbInterface.updateUserDetails(name, interestList, phone);
    prom.then( (docs) => {
      console.log("USER INTERESTS UPDATED", docs);
      socket.emit("serverReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  socket.on('addUserAttendingEvent', (name, eventId) => {
    let prom = dbInterface.addUserAttendingEvent(name, eventId);
    prom.then( (docs) => {
      console.log("USER ATTENDING NEW EVENT", docs);
      socket.emit("serverReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  socket.on('removeUserAttendingEvent', (name, eventId) => {
    let prom = dbInterface.addUserAttendingEvent(name, eventId);
    prom.then( (docs) => {
      console.log("USER NO LONGER ATTENDING", docs);
      socket.emit("serverReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  socket.on('addUserHostingEvent', (name, eventId) => {
    let prom = dbInterface.addUserHostingEvent(name, eventId);
    prom.then( (docs) => {
      console.log("ADDED HOST EVENT", docs);
      socket.emit("serverReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  socket.on('removeUserHostingEvent', (name, eventId) => {
    let prom = dbInterface.removeUserHostingEvent(name, eventId);
    prom.then( (docs) => {
      console.log("HOST REMOVED", docs);
      socket.emit("serverReply", docs);
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
      socket.emit("serverReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  socket.on('queryEvents', (keywordRegex, upperBound, lowerBound, numberBound) => {
    let prom = dbInterface.queryEvents(keywordRegex, upperBound, lowerBound, numberBound);
    prom.then( (docs) => {
      console.log("EVENTS", docs);
      socket.emit("serverReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
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

  socket.on('addEvent', (title, date, tag, location, locationName, type, host) => {
    let prom = dbInterface.addEvent(title, date, tag, location, locationName, type, host);
    prom.then( (docs) => {
      console.log("NEW EVENT", docs);
      socket.emit("serverReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  socket.on('updateEvent', (eventId, title, tag, location, locationName) => {
    let prom = dbInterface.updateEvent(eventId, title, tag, location, locationName);
    prom.then( (docs) => {
      console.log("EVENT UPDATED", docs);
      socket.emit("serverReply", docs);
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
      socket.emit("serverReply", docs);
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
      socket.emit("serverReply", docs);
    })
    .catch( (error) =>  {
      console.log("ERROR:", error);
      socket.emit("serverError", error)
    })
  })

  socket.on('addEventReview', (eventID, user, score, review) => {
    let prom = dbInterface.removeEventAttendee(eventID, attendee);
    prom.then( (docs) => {
      console.log("REVIEW ADDED", docs);
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
      socket.emit("serverReply", "Successfully sent to all recipients!")
    } catch (error) {
      console.log("ERROR:", error);
      socket.emit("serverError", error);
    }
  });
});
