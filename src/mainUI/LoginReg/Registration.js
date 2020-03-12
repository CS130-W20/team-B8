import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import BMLogo from './../BruinMeetLogo.png';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
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

/**
 * check if phone number is valid
 * @param num: string of phone number
 */
function validPhone (num) {
  if (!num){
    return false;
  }
  return (num.length === 9 && /^\d+$/.test(num));
}

/**
 * check if email address is valid
 * @param {String} email: string of email addr.
 */
function validEmail (email) {
  if (!email) {
    return false;
  }
  return (email.includes("ucla.edu"));
}

/**
 * check if password is valid
 * @param {String} pwd: string of password
 */
function validPassword (pwd) {
  if (!pwd) {
    return false;
  }
  return (pwd.length >= 7);
}


/**
 * ReactJS Class component for registering a user to the database
 * @author Phipson Lee
 * @since 03-05-2020
 */
class Registration extends Component {
  /**
   * @constructor
   * @param {Object} props Default object for constructor
   */
  constructor (props) {
    console.log("setting up socket");
    const io = require("socket.io-client"),
    socket = io.connect("http://localhost:8000");
    socket.emit('getAllEvents');
    super (props);
    this.state = {
      first_name: '',
      last_name: '',
      user_name: '',
      password: '',
      phone: '',
      register: false,
      error: false,
      socket: socket,
      emailErr: '',
      phoneErr: '',
      passwordErr: ''
    };
    this.handleOnChangeFirstName = this.handleOnChangeFirstName.bind(this);
    this.handleOnChangeLastName = this.handleOnChangeLastName.bind(this);
    this.handleOnChangePhone = this.handleOnChangePhone.bind(this);
    this.handleOnChangePassword = this.handleOnChangePassword.bind(this);
    this.handleOnChangeEmail = this.handleOnChangeEmail.bind(this);
    this.handleRegistration = this.handleRegistration.bind(this);
  }

  /**
   * Helper function to change first name
   * @param {String} e Event for on text change
   */
  handleOnChangeFirstName = e => {
    this.setState ({
      first_name: e.target.value,
    });
  };

    /**
   * Helper function to change last name
   * @param {String} e Event for on text change
   */
  handleOnChangeLastName = e => {
    this.setState ({
      last_name: e.target.value,
    });
  };

    /**
   * Helper function to change Phone number name
   * @param {String} e Event for on text change
   */
  handleOnChangePhone = e => {
    this.setState ({
      phone: e.target.value,
    });

    if (!validPhone(this.state.phone)) {
      this.setState({
        phoneErr: 'Please enter a valid U.S. phone number.'
      })
      console.log(this.state.phoneErr);
    } else {
      this.setState({
        phoneErr: ''
      })
    }

  };

  /**
   * Helper function to change password
   * @param {String} e Event for on text change
   */
  handleOnChangePassword = e => {
    this.setState ({
      password: e.target.value,
    });

    if (!validPassword(e.target.value)) {
      this.setState({
        passwordErr: 'Password must be at least 8 characters long.'
      })
      console.log(this.state.passwordErr);
    } else {
      this.setState({
        passwordErr: ''
      })
    }
  };

  /**
   * Helper function to change email
   * @param {String} e Event for on text change
   */
  handleOnChangeEmail = e => {
    this.setState ({
      email: e.target.value,
    });

    if (!validEmail(this.state.email)) {
      this.setState({
        emailErr: 'Please use a valid ucla.edu email.'
      })
      console.log(this.state.emailErr);
    } else {
      this.setState({
        emailErr:''
      })
    }
  };


  /**
   * Helper function to add user to database
   */
  handleRegistration = () => {
    // console.log("onsubmit: reg", this.props.socket);
    //e.preventDefault ();
    const data = {
      name: this.state.first_name + " " + this.state.last_name,
      email: this.state.email,
      phone: this.state.phone,
      password: this.state.password,
    };
    if (this.state.phoneErr + this.state.emailErr + this.state.passwordErr === '') {
      console.log("valid form");
      console.log("Register: ", data);
      this.state.socket.emit('addUser',data["name"], data["email"], data["password"], data["phone"]);
      this.props.successAlert("Successfully registered user! Login using your email and password!");
      this.props.returnToLogin();
    } else {
      console.log("invalid form");
    }
  };

  /**
   * Default render function for component
   */
  render () {
    const {classes} = this.props;
    return (
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div 
      data-testid="register"
      className={classes.paper}>
      <img alt={"BruinMeet Logo"} style={{width: 100, height: 100}}src={BMLogo}/>
        <Typography style={{paddingTop: 50}}component="h1" variant="h5">
          Create an Account
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            data-testid="register-first"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="first_name"
            label="First Name"
            name="firstName"
            autoComplete="First Name"
            value={this.state.first_name}
            onChange={this.handleOnChangeFirstName}
            autoFocus
          />
          <TextField
            data-testid="register-last"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="last_name"
            label="Last Name"
            name="lastName"
            autoComplete="Last Name"
            value={this.state.last_name}
            onChange={this.handleOnChangeLastName}
            autoFocus/>
          <TextField
            data-testid="register-email"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="Email"
            autoComplete="Email"
            value={this.state.email}
            onChange={this.handleOnChangeEmail}
            autoFocus/>
            {this.state.emailErr.length > 0 &&
              <span className='error'>{this.state.emailErr}</span>}
          <TextField
            data-testid="register-phone"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="Phone"
            autoComplete="Phone Number"
            value={this.state.phone}
            onChange={this.handleOnChangePhone}
            autoFocus/>
            {this.state.phoneErr.length > 0 &&
              <span className='error'>{this.state.phoneErr}</span>}
          <TextField
            data-testid="register-password"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={this.state.password}
            onChange={this.handleOnChangePassword}/>
            {this.state.passwordErr.length > 0 &&
              <span className='error'>{this.state.passwordErr}</span>}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={this.handleRegistration}>
            Create an Account
          </Button>
          <Grid container>
            <Grid item xs>
            </Grid>
            <Grid item>
              <Link 
                data-testid="login-account"
                onClick={this.props.returnToLogin}>
                {"Already have an account? Login here!"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
    );
  }
}
export default withStyles(styles, {withTheme: true})(Registration);
