import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SendIcon from '@material-ui/icons/Send';
import { IconButton } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }));

export default function EventMessage() {
    const classes = useStyles();
    const [dialogopen, setDOpen] = React.useState(false);

    const handleClickOpen = () => {
        setDOpen(true);
    };

    const handleClickClose = () => {
        setDOpen(false);
    };

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
            fullWidth/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClickClose} color="primary">
            {/* TODO: ADD TO DB AND UPDATE */}
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
