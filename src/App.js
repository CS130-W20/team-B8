import React from 'react';
import logo from './logo.svg';
import './App.css';
import SimpleMap from './mainUI/simpleMap';
import Dashboard from './mainUI/Dashboard';

function App() {
  return (
    <div>
      {Dashboard()}
    </div>
  );
}

export default App;
