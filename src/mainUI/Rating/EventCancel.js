import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Rating from '@material-ui/lab/Rating';
import { withStyles } from '@material-ui/core/styles';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { IconButton } from '@material-ui/core';

/**
 * Function component that uses Google Material UI Dialog Boxes
 * Uses IconButton to toggle display, and allows users to rate events they have attended
 * @see https://material-ui.com/components/dialogs/
 * @see https://material-ui.com/components/pickers/
 * @see EventHistory
 * 
 * @author Phipson Lee
 * @since 2020-02-15
 */
export default function EventCancel(props) {
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
    
    const removeFromEvent = () => {
      props.leaveEvent();
      handleClickClose();
    }

  /**
   * Renders a form onclick that allows users to offer ratings and review for host based on event
   */
  return (
      <div>
      <IconButton onClick={handleClickOpen}>
        <RemoveCircleIcon />
      </IconButton>
      <Dialog open={dialogopen} onClose={handleClickClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Do you want to leave this event? You can rejoin at a later point.</DialogTitle>
        <DialogActions>
          <Button onClick={handleClickClose} color="primary">
            Cancel
          </Button>
          <Button onClick={removeFromEvent} color="primary">
            Leave
          </Button>
        </DialogActions>
      </Dialog>
      </div>
  );
}
