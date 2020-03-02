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

export default class Registration extends Component {
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

  handleOnChangeUserName = e => {
    this.setState ({
      user_name: e.target.value,
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
      email: this.state.user_name,
      phone: this.state.phone,
      password: this.state.password,
    };
    console.log("Socket", this.state.socket);
    console.log("Register: ", data);
    this.state.socket.emit('addUser',data["name"], data["email"], data["password"], data["phone"]);
  };

  render () {
    const {register, error, user_name_taken} = this.state;

    return (
      <div className="Registration">
        <h1> {REGISTRATION_FIELDS.REGISTRATION_HEADING} </h1> <form
          onSubmit={this.onSubmit}
        >
          <div>
            <div className="fields">
              <p> {REGISTRATION_FIELDS.NAME} </p>
              {' '}
              <input
                type="text"
                value={this.state.name}
                name="FirstName"
                onChange={this.handleOnChangeFirstName}
              />
              {' '}
            </div> <div className="fields">
              <p> {REGISTRATION_FIELDS.PHONE} </p>
              {' '}
              <input
                type="text"
                value={this.state.Phone}
                name="LastName"
                onChange={this.handleOnChangePhone}
              />
              {' '}
            </div> <div className="fields">
              <p> {COMMON_FIELDS.USER_NAME} </p>
              {' '}
              <input
                type="text"
                //className={classNames ({error: user_name_taken})}
                value={this.state.user_name}
                name="Username"
                onBlur={this.handleOnBlur}
                onChange={this.handleOnChangeUserName}
                autoComplete="Username"
                required
              />
            </div> <div className="fields">
              <p> {COMMON_FIELDS.PASSWORD} </p>
              {' '}
              <input
                type="password"
                value={this.state.password}
                name="Password"
                onChange={this.handleOnChangePassword}
                autoComplete="password"
                required
              />
            </div> <div className="buttons">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={user_name_taken}
              >
                {' '}{REGISTRATION_FIELDS.REGISTER}{' '}
              </button>
              {' '}
              <Link to="/login"> {REGISTRATION_FIELDS.CANCEL} </Link>
              {' '}
            </div>{' '}
          </div>{' '}
        </form>
        {' '}
        {error && <Error message={ERROR_IN_REGISTRATION} />}
        {' '}
        {register && <Message message={REGISTRATION_MESSAGE} />}
        {' '}
      </div>
    );
  }
}
