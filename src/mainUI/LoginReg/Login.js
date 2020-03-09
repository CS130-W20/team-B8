import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
//import LoginService from '../services/LoginService';
import {
  REGISTRATION_FIELDS,
} from '../MessageBundle';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import BMLogo from './../BruinMeetLogo.png';

//const io = require("socket.io-client"),
//socket = io.connect("http://localhost:8000");
//socket.emit('getAllEvents');

const styles = theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_name: '',
      password: '',
      error: false,
      loginSuccess: false,
      socket: props.socket
    };

    this.handleOnChangeUserName = this.handleOnChangeUserName.bind(this);
    this.handleOnChangePassword = this.handleOnChangePassword.bind(this);
    this.handleSubmission = this.handleSubmission.bind(this);

    this.props.socket.on("authReply", (status, userID, token) => {
      console.log("serverReply: ", status);
      if (status === "SUCCESS") {
        this.props.login(userID, token);
        this.setState({
          error: false,
          loginSuccess: true,
        });
      }
      else if (status === "FAIL") {
        this.props.error();
        this.setState({
          loginSuccess: false,
          error: true,
        });
      }
    });
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

  handleSubmission = () => {
    console.log("onsubmit @login");
    const data = {
      username: this.state.user_name,
      password: this.state.password,
    };
    this.state.socket.emit("authenticate", data.username, data.password);
  };
  render() {
    const { classes } = this.props;

    return (
      <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <img style={{width: 250, height: 250}}src={BMLogo}/>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={this.state.user_name}
              onChange={this.handleOnChangeUserName}
              autoFocus/>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={this.state.password}
              onChange={this.handleOnChangePassword}
              autoComplete="current-password"/>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.handleSubmission}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
              </Grid>
              <Grid item>
              <Link onClick={this.props.registerUser}>
                     {REGISTRATION_FIELDS.REGISTER} </Link>  {' '}
              </Grid>
            </Grid>
            <Box mt={5}>
            </Box>
          </form>
        </div>
      </Grid>
      {/*<div className="Login">
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
    </div>*/}
    </Grid>
    );
  }
}
export default withStyles(styles, {withTheme: true})(Login);