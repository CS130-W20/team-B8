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

export default function EventForm() {
    const classes = useStyles();
    const [dialogopen, setDOpen] = React.useState(false);

    const handleClickOpen = () => {
        setDOpen(true);
    };

    const handleClickClose = () => {
        setDOpen(false);
    };

    // The first commit of Material-UI
    const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

    const handleDateChange = date => {
        setSelectedDate(date);
    };

    const [age, setAge] = React.useState('');
  
    const handleChange = event => {
      setAge(event.target.value);
    };

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

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
            id="name"
            label="Name of Event"
            type="email"
            fullWidth/>
            <LocationSearchInput/>
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
            }}/>
            <KeyboardTimePicker
            margin="normal"
            id="time-picker"
            label="Time picker"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
            'aria-label': 'change time',
            }}/>
            </MuiPickersUtilsProvider>
            <FormControl className={classes.formControl}>
            <InputLabel id="demo-controlled-open-select-label">Event Type</InputLabel>
            <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={age}
            onChange={handleChange}>
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Bar Hopping</MenuItem>
            <MenuItem value={20}>Rave</MenuItem>
            <MenuItem value={30}>House Party</MenuItem>
            <MenuItem value={40}>Music Concert/Festival</MenuItem>
            </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClickClose} color="primary">
            {/* TODO: ADD TO DB AND UPDATE */}
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
