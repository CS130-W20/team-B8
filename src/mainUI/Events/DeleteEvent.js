import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';

/**
 * Function component that uses Google Material UI Dialog Boxes
 * Uses IconButton to toggle display, and allows users Delete Events.
 * Currently incomplete, as we still need to display event information.
 * @see https://material-ui.com/components/dialogs/
 * @see https://material-ui.com/components/pickers/
 * 
 * @author Phipson Lee
 * @since 2020-02-15
 */
export default function EventDelete(props) {
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

    const handleDelete = () => {
      props.socket.emit('removeEvent', props._id);
      handleClickClose();
      props.successAlert("Successfully removed event");
      props.updateFunction();
    } 

  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog open={dialogopen} onClose={handleClickClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">You are about to delete this event. You cannot undo this action. Would you wish to continue?</DialogTitle>
        <DialogActions>
          <Button onClick={handleClickClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
