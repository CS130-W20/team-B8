import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Message from '../elements/Message';
import Error from '../elements/Error';
import {
  REGISTRATION_FIELDS,
  REGISTRATION_MESSAGE,
  COMMON_FIELDS,
  ERROR_IN_REGISTRATION,
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

/*const styles = {
    paperContainer: {
        backgroundImage: 'url(hhttps://source.unsplash.com/user/erondu/1600x900)'
    }
};*/

export default class Registration extends Component {
  constructor (props) {
    console.log("setting up socket");
    const io = require("socket.io-client"),
    socket = io.connect("http://localhost:8000");
    socket.emit('getAllEvents');
    super (props);
    this.state = {
      first_name: '',
      email: '',
      password: '',
      phone: '',
      register: false,
      error: false,
      socket: socket
    };
  }

  handleOnChangeFirstName = e => {
    this.setState ({
      first_name: e.target.value,
    });
  };

  handleOnChangePhone = e => {
    this.setState ({
      phone: e.target.value,
    });
  };

  handleOnChangeEmail = e => {
    this.setState ({
      email: e.target.value,
    });
  };

  handleOnChangePassword = e => {
    this.setState ({
      password: e.target.value,
    });
  };

  handleOnBlur = async e => {
    this.setState ({
      user_name: e.target.value,
    });
    // const data = {
    //   user_name: this.state.user_name,
    // };
    // socket.emit('getUser',data);
    // socket.on("reply",(status)=>{
    //   console.log("server reply: ", event);
    //   if (event=="EXISTS") this.setSate({user_name_taken:true});
    //   else this.setState({user_name_taken:false});
    // })
    // const isUsernameTaken = await UsernameValidation (data);

    // isUsernameTaken === 204
    //   ? this.setState ({user_name_taken: true})
    //   : this.setState ({user_name_taken: false});
  };

  onSubmit = async e => {
    // console.log("onsubmit: reg", this.props.socket);
    // e.preventDefault ();
    const data = {
      name: this.state.first_name,
      email: this.state.email,
      phone: this.state.phone,
      password: this.state.password,
    };
    console.log("Socket", this.state.socket);
    console.log("Register: ", data);
    this.state.socket.emit('addUser',data["name"], data["email"], data["password"], data["phone"]);
  };

  render () {
    const {register, error, user_name_taken} = this.state;
    const theme = createMuiTheme();
    return (
      //<Paper style={styles.paperContainer}>
      <Container component="main" maxWidth="xs">
      <h1></h1>
      <CssBaseline />
      <div marginTop={theme.spacing(8)}
           display='flex'
           flexDirection='column'
           alignItems='center'>
        <Avatar margin={theme.spacing(1)}
                backgroundColor={theme.palette.secondary.main}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form width='100%'
             marginTop={theme.spacing(1)} 
             noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="First Name"
                type="text"
                autoFocus
                onChange={this.handleOnChangeFirstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Phone Number"
                type="text"
                autoFocus
                onChange={this.handleOnChangePhone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Email"
                type="text"
                autoFocus
                onChange={this.handleOnChangeEmail}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Password"
                type="text"
                autoFocus
                onChange={this.handleOnChangePassword}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            margin={theme.spacing(3, 0, 2)}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
        {error && <Error message={ERROR_IN_REGISTRATION} />}
        {register && <Message message={REGISTRATION_MESSAGE} />}
      </div>
    </Container>
    //</Paper>
    );
  }
}
