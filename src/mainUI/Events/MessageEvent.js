import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SendIcon from '@material-ui/icons/Send';
import { IconButton } from '@material-ui/core';

/**
 * Function component that uses Google Material UI Dialog Boxes
 * Uses IconButton to toggle display, and allows users to send Message onClick
 * @see https://material-ui.com/components/dialogs/
 * 
 * @author Phipson Lee
 * @since 2020-02-15
 */
export default function EventMessage(props) {
/**
   * Hook set to false to indicate state of dashboard
   * Function that changes the state variable open
   */
  const [dialogopen, setDOpen] = React.useState(false);

  const [textMessage, setText] = React.useState('');

  /**
   * Function that sets the dialog box to close
   */
    const handleClickOpen = () => {
        setDOpen(true);
    };

  /**
   * Function that sets the dialog box to close
   */
    const handleClickClose = () => {
        setDOpen(false);
    };

    /**
     * Helper function that updates the type of text to display on the UI based on user input
     * @param {String} text 
     */
    const handleTextChange = (text) => {
      setText(text.target.value);
    }

    /**
     * Helper function that passes and calls notify all users via observer pattern in event interface
     */
    const handleMessage = () => {
      props.notifyFunction(textMessage, props.socket);
      handleClickClose();
      props.successAlert("Successfully notified all users!");
    }

  /**
   * Renders event form based on button click and state changes. Creates event upon submission of form.
   */
  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <SendIcon />
      </IconButton>
      <Dialog open={dialogopen} onClose={handleClickClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Send a Message to your Attendees</DialogTitle>
        <DialogContent>
            <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Your Message"
            type="email"
            value={textMessage}
            onChange={handleTextChange}
            fullWidth/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleMessage} color="primary">
            {/* TODO: ADD TO DB AND UPDATE */}
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
