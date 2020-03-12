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
import { eventTypes } from './../markerPrefab/mapMarker';
 
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
/**
 * Default constructor for component, as with all ReactJS Components
 * this.state is used to keep track of any changes in the FormInput and also (by default)
 * store the existing information of the event (in case the user wants to cancel)
 * 
 * Constructor also uses Google Maps API to fetch user's current location.
 * @param props This is a key-value object that is maintained to pass arguments
 * on construction; we are passing 1. the Event object and 2. a function object to update the EventList
 * @see google-maps-react For more information on navigator.geolocation
 * @see markerTypes
 */
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      date: '',
      location: '',
      title: '',
      dialogopen: false,
      open: false,
      type: '',
      description: '',
      image: null,
      previewImage: '',
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

  /**
   * Function is called when component is loaded onto DOM. In particular, we use this to 
   * Pass the arguments from the event (given in props) to the state
   */
  componentDidMount() {
    let previewImage = '';
    if(this.props.image){
      previewImage = 'data:image/jpeg;base64,' + this.props.image;
    }
    this.setState({
      id: this.props._id,
      date: this.props.date,
      location: this.props.location,
      title: this.props.title,
      type: this.props.type,
      description: this.props.description,
      previewImage: previewImage,
    })
  }

  /**
   * Helper function to update the existing event with all the new parameters and information
   */
  updateEvent() {
    Geocode.fromAddress(this.state.location).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;

        var newEvent = {
          eventId: this.state.id,
          title: this.state.title,
          date: this.state.date,
          location: {lat: lat, lng: lng},
          locationName: this.state.location,
          type: this.state.type,
          description: this.state.description,
        }

        socket.emit('updateEvent', newEvent.eventId, newEvent.title, newEvent.date, newEvent.location, newEvent.locationName, newEvent.type, newEvent.description);

        socket.on('updateEventReply', (event) => {
          var file = this.state.image
          if(file){
            var reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = function(){
              var dataBuffer = new Buffer(new Uint8Array(reader.result)); 
              socket.emit('addImage', newEvent.eventId, dataBuffer);
            }
          }
          console.log("updateEventReply: ", event);
          this.props.successAlert("Successfully updated the event: " + newEvent.title + "!");
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
   * Function that sets the dialog box to close
   */
    handleClickOpen = () => {
      this.setState({
        dialogopen: true
      })    
    };

  /**
   * Function that sets the dialog box to close
   */
    handleClickClose = () => {
      this.setState({
        dialogopen: false
      })    
    };

  /**
   * Function that takes in a date and updates the selected date for event
   * @param {String} date Date of the anticipated event passed as a string
   */
    handleDateChange = date => {
      this.setState({
        date: date
      })    
    };

  /**
   * Function that takes in a description and updates it for event
   * @param {String} date Description of event
   */
  handleDescriptionChange = description => {
    this.setState({
      description: description.target.value
    })    
  };

  /**
   * Function that changes the state variable type based on selected event type
   * @param {String} event Type of event based on onClick event listener
   */
  
    handleChange = event => {
      console.log(event.target.value)
      this.setState({
        type: event.target.value
      })    
    };

  /**
   * Function that sets the select menu to close
   */
    handleClose = () => {
      this.setState({
        open: false,
      })    
    };

  /**
   * Function that sets the select box to open
   */
    handleOpen = () => {
      this.setState({
        open: true
      })    
    };

  /**
   * Function that sets the select box to open
   */
    handleLocChange = address => {
      this.setState({
        location: address
      })
    }

  /**
   * Function that sets the select box to open
   */
    handleTextChange = text => {
      this.setState({
        title: text.target.value
      })
    }

    uploadImage = (e) => {
      var files = e.target.files
      if(files.length > 0){
        var reader = new FileReader();
        reader.onload = (e) => {
          this.setState({previewImage: e.target.result});
        }
        reader.readAsDataURL(files[0]);
        this.setState({image: files[0]});
      }
    }

    getImageContainerStyle = () => ({
      width: '550px',
      height: '200px',
      overflow: 'hidden',
      marginBottom: '-40px',
  })
  getImageStyle = () => ({
      height: 'auto',
      width: '550px',
  });

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
          <div style={this.getImageContainerStyle()}>
            <img style={this.getImageStyle()} alt={"Event Representation"} src={this.state.previewImage ? 
            this.state.previewImage
            : 'https://lh3.googleusercontent.com/proxy/Qe8V5Hwb-cD6ZXzkehYtxggyL9ODf86fvHXoIflZM-27jbbL8V5qcsXS1MkeHJMZsiWpm5n5FS2cL9MrIDCjV1Y-_y99c263BBYayegnQnAAz_nhPG44rWhaWE3k'}/>
            </div>
            <Button style={{height: '50px', position: 'relative', top:'0px', left: '400px', marginBottom: '0px'}}
                variant="contained"
                component="label"
                >
                  Upload image
                  <input
                    type="file"
                    style={{display: "none"}}
                    onChange={this.uploadImage}
                  />
              </Button>
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
              <TextField
                margin="dense"
                label="Description"
                value={this.state.description}
                multiline
                rows={2}
                rowsMax={4}
                onChange={this.handleDescriptionChange}
                fullWidth
              />
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
