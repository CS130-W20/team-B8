const io = require("socket.io-client"),
    socket = io.connect("http://localhost:8000");

export const addEvent = ({title, date, tag, location, locationName, type, host}) => {
    socket.emit('addEvent', title, date, tag, location, locationName, type, host);
}