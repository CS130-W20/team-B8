// EXAMPLE OF CLIENT SIDE CONNECTIONS

const
    io = require("socket.io-client"),
    socket = io.connect("http://localhost:8000");

// TEST SOCKET CONNECTION
socket.emit('test', "CLIENT: Hi Server!");

// SERVER REPLIES
// Generic server replies to emits.
// Created distinct events for data: getUserReply, getEventReply.
socket.on("serverReply", (msg) => console.log("SERVER REPLY:", msg));
socket.on("serverError", (err) => console.log("SERVER ERROR:", err));

// user schema in dbInterface.js
const newUser = {
  name: "Sean Derman",
  email: "sd@ucla.edu",
  password: "pass",
  phone: "626" /* note this is a string */
}

// TEST USER CREATION
socket.emit('addUser', newUser.name, newUser.email,
newUser.password, newUser.phone);

// TEST USER GET
socket.on('getUserReply', (user) => {
  console.log("getUserReply: ", user);
})
socket.emit('getUser', "Sean Derman");

// event schema in dbInterface.js
const newEvent = {
  eventId: 0001,
  title: "CS130 Dis1b",
  tag: ["fun", "swe", "A"],
  location: null,
  locationName: "Royce",
  host: "Sean Derman"
}

// TEST EVENT CREATION
socket.emit('addEvent', newEvent.eventId, newEvent.title, newEvent.tag, newEvent.location, newEvent.locationName, newEvent.host);

// TEST EVENT GET
socket.on('getEventReply', (event) => {
  console.log("getEventReply: ", event);
})
socket.emit('getEvent', newEvent.eventId);
