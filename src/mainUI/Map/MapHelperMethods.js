const
    io = require("socket.io-client"),
    socket = io.connect("http://localhost:8000");

export class MapHelperClass {
    static getAllEvents() {
        socket.emit('getAllEvents');

        socket.on('serverReply', (event) => {
            console.log("serverReply: ", event);
            return event;
        });
    }
}