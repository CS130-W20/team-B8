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

/**
 * Default app component to be rendered on screen when users open the app
 * Sets to dashboard, landing page, or registration page based on state
 */
export default class App extends React.Component{

  /**
   * @constructor
   * Default constructor for props; sets the default state to be on the login page unless a token is stored locally
   * @param {Object} props Default object containing all the properties for component
   */
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
    this.handleClose = this.handleClose.bind(this);
    this.isTokenExpired = this.isTokenExpired.bind(this);
    this.logout = this.logout.bind(this);
    this.returnFailMessage = this.returnFailMessage.bind(this);
    this.returnSuccessMessage = this.returnSuccessMessage.bind(this);
    this.loginError = this.loginError.bind(this)
  }

  /**
   * React state function that checks whether a valid token has been stored locally since previous access to web app
   */
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

  /**
   * Helper function that logs user in based on existing token or userID
   * @param {String} token a uniquely generated JWT token that is verified before being used
   * @param {String} userID the user email that is used to key and search through user in database
   */
  login = (userID, token) => {
    localStorage.setItem('id_token', token);
    localStorage.setItem('id_user', userID);
    console.log("loggin in...");
    this.setState({loggedIn: true, user: userID}, 
      () => this.returnSuccessMessage("Successfully logged in. Have fun!"));
  }

  /**
   * Helper function that is used to log the user out on query
   */
  logout = () => {
    this.setState({loggedIn: false, user: ""},
      () => this.returnSuccessMessage("Successfully logged out. Hope to see you soon!"));
  }

  /**
   * Helper function to alert user of any error with login
   */
  loginError = () => {
    this.setState({loggedIn: false, user: ""},
      () => this.returnFailMessage("Couldn't find user. Please register or try to login again"));
  }

  /**
   * Helper function to switch app state to register
   */
  register = () => {
    this.setState({
      loggedIn: false,
      register: true,
    })
  }

  /**
   * Helper function to return user from register page to login page
   */
  returnToLogin = () => {
    this.setState({
      loggedIn: false,
      register: false,
    })
  }

  /** 
   * Helper function to close the notification/alert dialog at the bottom of the screen
   */
  handleClose = () => {
    this.setState({
      open: false,
      displayGreen: false,
      displayRed: false,
    })
  }

  /**
   * Helper function to check whether the token is expired (for over 2 hours)
   * @param {String} token JWT Token to be generated and used for logging in if valid
   */
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

  /**
   * Helper function to display success (green) message (notification/dialog at bottom of screen)
   * @param {String} message The string to be displayed in the dialog/notification
   */
  returnSuccessMessage = (message) => {
    this.setState({
      displayMessage: message,
      displayGreen: true,
      displayRed: false,
    });
  }

  /**
   * Helper function to display error (red) message (notification/dialog at bottom of screen)
   * @param {String} message The string to be displayed in the dialog/notification
   */
  returnFailMessage = (message) => {
    this.setState({
      displayMessage: message,
      displayRed: true,
      displayGreen: false
    });
  }

  /**
   * Default render function for react components
   */
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
