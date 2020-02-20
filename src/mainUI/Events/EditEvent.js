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
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import LocationSearchInput from './LocationSearcher';
import Geocode from "react-geocode";
import { markerTypes } from './../markerPrefab/mapMarker';
 
const
    io = require("socket.io-client"),
    socket = io.connect("http://localhost:8000");

/**
 * @function useStyle Function object that generates a style off of default MaterialsUI Theme
 * @see https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/dashboard
 * @see https://material-ui.com/styles/basics/
 */
const styles = theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  });

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyD2EzcDG507GgPgPHVEoVpgFngvsMGIElg");
 
// set response language. Defaults to english.
Geocode.setLanguage("en");
 
// Enable or disable logs. Its optional.
Geocode.enableDebug();

/**
 * React component that uses Google Material UI Dialog Boxes
 * Uses IconButton to toggle display, and allows users update/Edit Events.
 * Currently incomplete, as we still need to display event information.
 * @see https://material-ui.com/components/dialogs/
 * @see https://material-ui.com/components/pickers/
 * 
 * @author Phipson Lee
 * @since 2020-02-15
 */
class EventEdit extends Component{
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      location: '',
      title: '',
      dialogopen: false,
      open: false,
      type: '',
      event: props.event,
    }
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClickClose = this.handleClickClose.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.handleLocChange = this.handleLocChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  componentDidMount() {
    console.log(this.props.event);
    console.log(this.state.event);
    this.setState({
      date: this.state.event.date,
      location: this.state.event.location,
      title: this.state.event.name,
      type: this.state.event.tag[0],
    })
  }

  updateEvent() {
    Geocode.fromAddress(this.state.location).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;

        var newEvent = {
          eventId: 1,
          title: this.state.title,
          tag: [this.state.type],
          location: {lat: lat, lng: lng},
          locationName: this.state.location,
        }

        socket.emit('updateEvent', newEvent.eventId, newEvent.title, newEvent.tag,
        newEvent.location, newEvent.locationName);

        socket.on('serverReply', (event) => {
          console.log("serverReply: ", event);
          this.props.updateFunction();
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
        open: false,
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
  render() {
    const {classes} = this.props;
    return (
      <div>
        <IconButton onClick={this.handleClickOpen}>
          <EditIcon />
        </IconButton>
        <Dialog open={this.state.dialogopen} onClose={this.handleClickClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Update Your Event</DialogTitle>
          <DialogContent>
              <TextField
              autoFocus
              margin="dense"
              id="name"
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
              id="date-picker-dialog"
              format="MM/dd/yyyy"
              value={this.state.date}
              onChange={this.handleDateChange}
              KeyboardButtonProps={{
              'aria-label': 'change date',
              }}/>
              <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              value={this.state.date}
              onChange={this.handleDateChange}
              KeyboardButtonProps={{
              'aria-label': 'change time',
              }}/>
              </MuiPickersUtilsProvider>
              <FormControl className={classes.formControl}>
              <InputLabel id="demo-controlled-open-select-label">Event Type</InputLabel>
              <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              open={this.state.open}
              onClose={this.handleClose}
              onOpen={this.handleOpen}
              value={this.state.type}
              onChange={this.handleChange}>
              <MenuItem value="">
                  <em>None</em>
              </MenuItem>
              <MenuItem value={markerTypes.food}>Bar Hopping</MenuItem>
              <MenuItem value={markerTypes.dance}>Rave</MenuItem>
              <MenuItem value={markerTypes.hats}>House Party</MenuItem>
              <MenuItem value={markerTypes.dj}>Music Concert/Festival</MenuItem>
              </Select>
              </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClickClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.updateEvent} color="primary">
              {/* TODO: ADD TO DB AND UPDATE */}
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  };
}

export default withStyles(styles, {withTheme: true})(EventEdit);
