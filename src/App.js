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
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
const io = require("socket.io-client"),

socket = io.connect("http://localhost:8000");
//socket.emit('getAllEvents');

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      loggedIn: false,
      register: false,
      socket:  socket,
      open: false,
      user: ""
    };
    this.login= this.login.bind(this);
    this.register = this.register.bind(this);
    this.returnToLogin = this.returnToLogin.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.state = {
      loggedIn: false,
      register: false,
      socket:  socket,
      open: false,
      user: ""
    };
  }

  login = (userID) => {
    console.log("loggin in...");
      this.setState({loggedIn: true, user: userID, open: true});
  }

  register = () => {
    this.setState({
      loggedIn: false,
      register: true,
    })
  }

  returnToLogin = () => {
    this.setState({
      loggedIn: false,
      register: false,
    })
  }

  handleOpen = () => {
    this.setState({
      open: true
    })
  }

  handleClose = () => {
    this.setState({
      open: false
    })
  }

  render() {
    return (
      <div>
        <Snackbar open={this.state.open && !this.state.loggedIn} autoHideDuration={6000} onClose={this.handleClose}>
          <Alert severity="error">Failed to log in</Alert>
        </Snackbar>
        <Snackbar open={this.state.open && this.state.loggedIn} autoHideDuration={6000} onClose={this.handleClose}>
          <Alert severity="success">Successfully logged in! Have fun!</Alert>
        </Snackbar>
      {this.state.loggedIn?
      <Router>
        <div>
          <Dashboard socket={this.state.socket} userID={this.state.user}/>
        </div>
      </Router>
      :
      this.state.register?
      <Router>
        <div>
          <Registration socket={socket} returnToLogin={this.returnToLogin}/>
        </div>
      </Router>
      :
      <Router>
        <div>
          <Login socket={socket} login={this.login} registerUser={this.register} error={this.handleOpen}/>
        </div>
      </Router>}
      </div>
    );
  }
}
