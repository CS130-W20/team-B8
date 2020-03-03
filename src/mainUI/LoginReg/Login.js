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
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
//import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


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
    const theme = createMuiTheme();  
  return(
    
    <Container component="main" maxWidth="xs">
    <h1></h1>
      <CssBaseline />
          <div marginTop={theme.spacing(8)}
               display='flex'
               flexDirection='column'
               alignItems='cener'>
        <Avatar margin={theme.spacing(1)}
                backgroundColor={theme.palette.secondary.main}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
            Sign in
        </Typography>
          <form width='100%'
                marginTop={theme.spacing(1)} 
                noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="Username"
              label="Username"
              name="Username"
              autoFocus
              onChange={this.handleOnChangeUserName}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={this.handleOnChangePassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={this.onSubmit}
              margin={theme.spacing(3,0,2)}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
          {loginSuccess && <Message message={LOGIN_MESSAGE} />}
          {error && <Error message={ERROR_IN_LOGIN} />}
          </div>
          

      </Container>
     
    );
  }
}
