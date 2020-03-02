import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import LoginService from '../services/LoginService';
import Message from '../elements/Message';
import Error from '../elements/Error';
import {
  COMMON_FIELDS,
  REGISTRATION_FIELDS,
  LOGIN_FIELDS,
  LOGIN_MESSAGE,
  ERROR_IN_LOGIN,
} from '../MessageBundle';

//const io = require("socket.io-client"),
//socket = io.connect("http://localhost:8000");
//socket.emit('getAllEvents');

export default class Login extends Component {
  constructor(props) {
    super(props);
    const io = require("socket.io-client"),
    socket = io.connect("http://localhost:8000");

    this.state = {
      user_name: '',
      password: '',
      error: false,
      loginSuccess: false,
      socket: socket
      // login: this.props.login
    };
  }

  handleOnChangeUserName = (e) => {
    this.setState({
      user_name: e.target.value,
    });
  };

  handleOnChangePassword = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  onSubmit = async (e) => {
    console.log("onsubmit @login");
    const data = {
      username: this.state.user_name,
      password: this.state.password,
    };
    this.state.socket.emit("authenticate", data.username, data.password);

      this.state.socket.on("authReply", (status, userID) => {
        console.log("serverReply: ", status);
        if (status == "SUCCESS") {
          this.props.login(userID);
          this.setState({
            error: false,
            loginSuccess: true,
          });
        }
        else if (status == "FAIL")
      {
        this.setState({
          loginSuccess: false,
          error: true,
        });
      }
    });
  };

  render() {
    const { loginSuccess, error } = this.state;

    return (
      <div className="Login">
        <h1> {LOGIN_FIELDS.LOGIN_HEADING} </h1> {' '}
        <form onSubmit={this.onSubmit}>
          <div>
            <div className="fields">
              <p> {"Name"} </p>    {' '}
              <input
                type="text"
                name="Username"
                onChange={this.handleOnChangeUserName}
                autoComplete="Username"
                required
              />
            </div>{' '}
            {' '}
            <div className="fields">
              {' '}
              <p> {COMMON_FIELDS.PASSWORD} </p>    {' '}
              <input
                type="password"
                name="Password"
                onChange={this.handleOnChangePassword}
                autoComplete="Password"
                required
              />{' '}
                  {' '}
            </div>{' '}
            {' '}
            <div className="buttons">
              {' '}
              <button
                type="button"
                onClick={this.onSubmit}
                className="btn btn-primary"
              >
                {' '}
                  {LOGIN_FIELDS.LOGIN}    {' '}
              </button>{' '}
                 <Link to="/register">
                     {REGISTRATION_FIELDS.REGISTER} </Link>  {' '}
               {' '}
            </div>{' '}
               {' '}
          </div>{' '}
           {' '}
        </form>{' '}
            {loginSuccess && <Message message={LOGIN_MESSAGE} />}    {' '}
        {error && <Error message={ERROR_IN_LOGIN} />}    {' '}
      </div>
    );
  }
}
