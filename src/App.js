import React from 'react';
import decode from 'jwt-decode';
import './App.css';
import {
  BrowserRouter as Router,
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
      displayGreen: false,
      displayRed: false,
      displayMessage: '',
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
    this.isTokenExpired = this.isTokenExpired.bind(this);
    this.logout = this.logout.bind(this);
    this.returnFailMessage = this.returnFailMessage.bind(this);
    this.returnSuccessMessage = this.returnSuccessMessage.bind(this);
    this.loginError = this.loginError.bind(this)
  }

  componentDidMount() {
    var user = localStorage.getItem('id_user');
    var token = localStorage.getItem('id_token');
    console.log('userToken: ', token, user);
    if (token != null && user != null) {
      if (!this.isTokenExpired(token)) {
        this.setState({loggedIn: true, user: user});
      }
    }
  }

  login = (userID, token) => {
    localStorage.setItem('id_token', token);
    localStorage.setItem('id_user', userID);
    console.log("loggin in...");
    this.setState({loggedIn: true, user: userID}, 
      () => this.returnSuccessMessage("Successfully logged in. Have fun!"));
  }

  logout = () => {
    this.setState({loggedIn: false, user: ""},
      () => this.returnSuccessMessage("Successfully logged out. Hope to see you soon!"));
  }

  loginError = () => {
    this.setState({loggedIn: false, user: ""},
      () => this.returnFailMessage("Couldn't find user. Please register or try to login again"));
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
      open: false,
      displayGreen: false,
      displayRed: false,
    })
  }

  isTokenExpired = token => {
    try {
      const decodedToken = decode(token);
      console.log("expiry: ", decodedToken.exp, Date.now()/1000);
      if (decodedToken.exp < Date.now()/1000) {
        console.log('Valid token');
        return true;
      }
      return false;
    }
    catch (err) {
      return false;
    }
  }

  returnSuccessMessage = (message) => {
    this.setState({
      displayMessage: message,
      displayGreen: true,
      displayRed: false,
    });
  }

  returnFailMessage = (message) => {
    this.setState({
      displayMessage: message,
      displayRed: true,
      displayGreen: false
    });
  }

  render() {
    return (
      <div>
        <Snackbar open={this.state.displayGreen} autoHideDuration={3000} onClose={this.handleClose}>
          <Alert severity="success">{this.state.displayMessage}</Alert>
        </Snackbar>
        <Snackbar open={this.state.displayRed} autoHideDuration={3000} onClose={this.handleClose}>
          <Alert severity="error">{this.state.displayMessage}</Alert>
        </Snackbar>
      {this.state.loggedIn?
      <Router>
        <div>
          <Dashboard socket={this.state.socket} 
            userID={this.state.user} 
            logoutFunction={this.logout} 
            successAlert={this.returnSuccessMessage}
            failAlert={this.returnFailMessage}
            loginError={this.loginError}/>
        </div>
      </Router>
      :
      this.state.register?
      <Router>
        <div>
          <Registration socket={socket} 
          returnToLogin={this.returnToLogin}
          successAlert={this.returnSuccessMessage}
          failAlert={this.returnFailMessage}/>
        </div>
      </Router>
      :
      <Router>
        <div>
          <Login socket={socket} login={this.login} 
          registerUser={this.register} 
          error={this.handleOpen}
          successAlert={this.returnSuccessMessage}
          failAlert={this.returnFailMessage}/>
        </div>
      </Router>}
      </div>
    );
  }
}
