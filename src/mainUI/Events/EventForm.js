import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles';
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

import { addEvent } from '../../sockets/sockets.js';

/**
 * @var useStyle Function object that generates a style off of default MaterialsUI Theme
 * @see https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/dashboard
 * @see https://material-ui.com/styles/basics/
 */
const useStyles = makeStyles(theme => ({
    button: {
      display: 'block',
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }));

/**
 * Function component that uses Google Material UI Dialog Boxes
 * Uses IconButton to toggle display, and allows users create Events.
 * @see https://material-ui.com/components/dialogs/
 * @see https://material-ui.com/components/pickers/
 * 
 * @author Phipson Lee, Lawrence Lee
 * @since 2020-02-15
 */
export default function EventForm() {
  /**
   * @var classes Calls Material-UI useStyles to generate/inherit material UI styles generated from a default theme
   */
  const classes = useStyles();

  const titleId = "title";
  const locationNameId = "location";

  /**
   * @var dialogopen Hook set to false to indicate state of dashboard
   * @var setDOpen Function that changes the state variable open
   */
    const [dialogopen, setDOpen] = React.useState(false);

  /**
   * @var handleClickOpen Function that sets the dialog box to close
   */
    const handleClickOpen = () => {
        setDOpen(true);
    };

  /**
   * @var handleClickClose Function that sets the dialog box to close
   */
    const handleClickClose = () => {
        setDOpen(false);
    };

  /**
   * @var selectedDate Hook set to default date. Changes date of event
   * @var setSelectedDate Function that changes the state variable selectedDate
   * @see https://material-ui.com/components/pickers/
   */
    const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

  /**
   * @var handleDateChange Function that takes in a date and updates the selected date for event
   * @param {*} date 
   */
    const handleDateChange = date => {
        setSelectedDate(date);
    };

  /**
   * @var type Hook set to none by default. Configures the type of event user wants.
   * @var setType Function that changes the state variable type
   */
    const [type, setType] = React.useState('');
  
    const handleChange = event => {
      setType(event.target.value);
    };

  /**
   * @var open Hook set to false to indicate state of select menu
   * @var setOpen Function that changes the state variable open
   */
    const [open, setOpen] = React.useState(false);

  /**
   * @var handleClose Function that sets the select menu to close
   */
    const handleClose = () => {
        setOpen(false);
    };

  /**
   * @var handleClose Function that sets the select box to open
   */
    const handleOpen = () => {
        setOpen(true);
    };

  const [waitingForLocation, setWaitingForLocation] = React.useState(false);
  const [location, setLocation] = React.useState({});

  /**
    * @var handleClickCreate Function that submits form after clicking create
    */
  const handleClickCreate = () => {
    let title = document.getElementById(titleId).value;
    let date = selectedDate;
    let tag = [];
    let locationName = document.getElementById(locationNameId).value;
    //let location = location;
    let host = "me";
    addEvent({title, date, tag, location, locationName, type, host});
    setDOpen(false);
  };
  /**
    * @var handleClickCancel Function that cancels current event form
    */
  const handleClickCancel = () => {
      setDOpen(false);
  };

  /**
   * Renders event form based on button click and state changes. Creates event upon submission of form.
   */
  return (
    <div style={{justifyContent: 'center', width: "100%", display: "grid", padding: "1.5%"}}>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Host a New Event
      </Button>
      <Dialog open={dialogopen} onClose={handleClickClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create a New Event</DialogTitle>
        <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id={titleId}
              label="Name of Event"
              type="email"
              fullWidth
            />
            <LocationSearchInput locationNameId={locationNameId} setLocation={setLocation} setWaitingForLocation={setWaitingForLocation}/>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Date picker dialog"
              format="MM/dd/yyyy"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="Time picker"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
            </MuiPickersUtilsProvider>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-controlled-open-select-label">Event Type</InputLabel>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                value={type}
                onChange={handleChange}>
                  <MenuItem value="">
                      <em>None</em>
                  </MenuItem>
                  <MenuItem value={"bar"}>Bar Hopping</MenuItem>
                  <MenuItem value={"rave"}>Rave</MenuItem>
                  <MenuItem value={"house"}>House Party</MenuItem>
                  <MenuItem value={"concert"}>Music Concert/Festival</MenuItem>
            </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClickCreate} disabled={waitingForLocation} color="primary">
            {/* TODO: ADD TO DB AND UPDATE */}
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
