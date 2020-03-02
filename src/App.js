import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Dashboard from './mainUI/Dashboard';
import Login from './mainUI/LoginReg/Login';
import Registration from './mainUI/LoginReg/Registration';
const io = require("socket.io-client"),

socket = io.connect("http://localhost:8000");
socket.emit('getAllEvents');

export default class App extends React.Component{

  login = (userID) => {
    console.log("loggin in...");
      this.setState({loggedIn:true});
      this.setState({user: userID});
  }

  constructor(props){
  super(props);
  this.state = {
    loggedIn: false,
    register: false,
    socket:  socket,
    user: ""
  };
  this.login=this.login.bind(this);
}

  render() {
    return (

      this.state.loggedIn?
      <Router>
        <div>
          <Dashboard socket={this.state.socket} />
        </div>
      </Router>
      :
      this.state.register?
      <Router>
        <div>
        <Registration socket={socket}/>
          <Switch>
            <Route exact path="/register" component={Registration} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </div>
      </Router>
      :
      <Router>
        <div>
        <Login login={this.login}/>
          <Switch>
            <Route exact path="/register" component={Registration} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </div>
      </Router>
    );
  }
}
