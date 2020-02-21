import React from 'react';
import './App.css';
import Dashboard from './mainUI/Dashboard';

const io = require("socket.io-client"),
socket = io.connect("http://localhost:8000");

socket.emit('getEvents', 'me');

export default function App() {
  return (
    <div>
      <Dashboard socket={socket}/>
    </div>
  );
}