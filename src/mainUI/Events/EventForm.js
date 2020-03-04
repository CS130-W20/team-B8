import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import LocationSearchInput from './LocationSearcher';
import Geocode from "react-geocode";
import { eventTypes, markerTypes } from './../markerPrefab/mapMarker';
 
const
    io = require("socket.io-client"),
    socket = io.connect("http://localhost:8000");

/**
 * @var useStyle Function object that generates a style off of default MaterialsUI Theme
 * @see https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/dashboard
 * @see https://material-ui.com/styles/basics/
 */
const styles = theme => ({
    button: {
      display: 'block',
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  });

/**
 * Function component that uses Google Material UI Dialog Boxes
 * Uses IconButton to toggle display, and allows users create Events.
 * @see https://material-ui.com/components/dialogs/
 * @see https://material-ui.com/components/pickers/
 * 
 * @author Phipson Lee, Lawrence Lee
 * @since 2020-02-15
 */
class EventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      location: '',
      title: '',
      dialogopen: false,
      open: false,
      type: '',
    }
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClickClose = this.handleClickClose.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleLocChange = this.handleLocChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.createEvent = this.createEvent.bind(this);
  }

  /**
   * @function createEvent Helper function to query mongoDB server and create event object
   */
  createEvent() {
    if (this.state == null)
      this.handleClickClose();

    Geocode.fromAddress(this.state.location).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;

        var newEvent = {
          eventId: 1,
          title: this.state.title,
          date: this.state.date,
          tag: [this.state.type],
          location: {lat: lat, lng: lng},
          locationName: this.state.location,
          type: this.state.type,
          host: this.props.userID.name
        }

        socket.emit('addEvent', newEvent.title, newEvent.date, newEvent.tag, newEvent.location, newEvent.locationName, newEvent.type, newEvent.host);
        socket.on('addEventReply', (event) => {
          this.props.updateFunction();
          socket.emit('addUserHostingEvent', this.props.userID.name, event._id);
        })
      },
      error => {
        console.error(error);
      }
    );
    this.handleClickClose();
  }


  /**
   * @function handleClickOpen Function that sets the dialog box to close
   */
    handleClickOpen = () => {
      this.setState({
        dialogopen: true
      })    
    };

  /**
   * @function handleClickClose Function that sets the dialog box to close
   */
    handleClickClose = () => {
      this.setState({
        dialogopen: false
      })    
    };

  /**
   * @function handleDateChange Function that takes in a date and updates the selected date for event
   * @param {String} date Date of the anticipated event passed as a string
   */
    handleDateChange = date => {
      this.setState({
        date: date
      })    
    };

  /**
   * @function handleChange Function that changes the state variable type based on selected event type
   * @param {String} event Type of event based on onClick event listener
   */
  
    handleChange = event => {
      this.setState({
        type: event.target.value
      })    
    };

  /**
   * @function handleClose Function that sets the select menu to close
   */
    handleClose = () => {
      this.setState({
        open: false
      })    
    };

  /**
   * @function handleClose Function that sets the select box to open
   */
    handleOpen = () => {
      this.setState({
        open: true
      })    
    };

  /**
   * @function handleLocChange Function that sets the select box to open
   */
    handleLocChange = address => {
      console.log('updated ' + address);
      this.setState({
        location: address
      })
    }

  /**
   * @function handleTextChange Function that sets the select box to open
   */
    handleTextChange = text => {
      this.setState({
        title: text.target.value
      })
    }

  /**
   * Renders event form based on button click and state changes. Creates event upon submission of form.
   */
  render(){
    const {classes} = this.props;
  return (
    <div style={{justifyContent: 'center', width: "100%", display: "grid", padding: "1.5%"}}>
      <Button data-testid="event-create-button" variant="contained" color="primary" onClick={this.handleClickOpen}>
        Host a New Event
      </Button>
      <Dialog data-testid="event-create-dialog" open={this.state.dialogopen} onClose={this.handleClickClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Create A New Event</DialogTitle>
          <DialogContent>
              <TextField
              autoFocus
              margin="dense"
              inputProps={{
                "data-testid" :"event-title"
              }}
              id="event-title"
              label="Name of Event"
              value={this.state.title}
              onChange={this.handleTextChange}
              type="email"
              fullWidth/>
              <LocationSearchInput
                default={this.state.location}
                updateFunction={this.handleLocChange}/>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
              margin="normal"
              id="event-date"
              inputProps={{
                "data-testid" :"event-date"
              }}
              format="MM/dd/yyyy"
              value={this.state.date}
              onChange={this.handleDateChange}
              KeyboardButtonProps={{
              'aria-label': 'change date',
              }}/>
              <KeyboardTimePicker
              margin="normal"
              id="event-time"
              inputProps={{
                "data-testid":"event-time"
              }}
              value={this.state.date}
              onChange={this.handleDateChange}
              KeyboardButtonProps={{
              'aria-label': 'change time',
              }}/>
              </MuiPickersUtilsProvider>
              <FormControl className={classes.formControl}>
              <InputLabel id="demo-controlled-open-select-label">Event Type</InputLabel>
              <Select
              inputProps={{
                "data-testid":"event-select"
              }}
              labelId="demo-controlled-open-select-label"
              id="event-select"
              open={this.state.open}
              onClose={this.handleClose}
              onOpen={this.handleOpen}
              value={this.state.type}
              onChange={this.handleChange}>
              <MenuItem value="">
                  <em>None</em>
              </MenuItem>
              <MenuItem value={eventTypes.barHopping}>Bar Hopping</MenuItem>
              <MenuItem value={eventTypes.rave}>Rave</MenuItem>
              <MenuItem value={eventTypes.houseParty}>House Party</MenuItem>
              <MenuItem value={eventTypes.music}>Music Concert/Festival</MenuItem>
              </Select>
              </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClickClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.createEvent} color="primary" data-testid="event-create">
              {/* TODO: ADD TO DB AND UPDATE */}
              Create
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );}
}

export default withStyles(styles, {withTheme: true})(EventForm);
