import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

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
 * @param email: string of email addr.
 */
function validEmail (email) {
  if (!email) {
    return false;
  }
  return (email.includes("ucla.ed"));
}

/**
 * check if password is valid
 * @ param pwd: string of password
 */
function validPassword (pwd) {
  if (!pwd) {
    return false;
  }
  return (pwd.length >= 7);
}


class Registration extends Component {
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
    this.handleOnChangeUserName = this.handleOnChangeUserName.bind(this);
    this.handleOnChangePassword = this.handleOnChangePassword.bind(this);
    this.handleOnChangeEmail = this.handleOnChangeEmail.bind(this);
    this.handleRegistration = this.handleRegistration.bind(this);
  }

  handleOnChangeFirstName = e => {
    this.setState ({
      first_name: e.target.value,
    });
  };

  handleOnChangeLastName = e => {
    this.setState ({
      last_name: e.target.value,
    });
  };

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

  handleOnChangeUserName = e => {
    this.setState ({
      user_name: e.target.value,
    });
  };

  handleOnChangePassword = e => {
    this.setState ({
      password: e.target.value,
    });

    if (!validPassword(this.state.password)) {
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
      this.props.returnToLogin();
    } else {
      console.log("invalid form");
    }
  };

  render () {
    const {classes} = this.props;
    return (
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create an Account
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
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
              <Link onClick={this.props.returnToLogin}>
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
