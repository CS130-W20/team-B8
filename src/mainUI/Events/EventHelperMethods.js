const
    io = require("socket.io-client"),
    socket = io.connect("http://localhost:8000");

export class EventHelperClass {
    static createEvent(newEvent) {
        socket.emit('addEvent', newEvent.eventId, newEvent.title, newEvent.tag,
        newEvent.location, newEvent.locationName, newEvent.host);

        socket.on('getEventReply', (event) => {
            console.log("getEventReply: ", event);
        })
    }

    static updateEvent(newEvent) {
        socket.emit('updateEvent', newEvent.eventId, newEvent.title, newEvent.tag, newEvent.location, newEvent.locationName);
    }
}