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
import RateReviewIcon from '@material-ui/icons/RateReview';
import { IconButton } from '@material-ui/core';

/**
 * @var useStyle Function object that generates a style off of default MaterialsUI Theme
 * @see https://material-ui.com/styles/basics/
 */
const StyledRating = withStyles({
    iconFilled: {
      color: '#ff6d75',
    },
    iconHover: {
      color: '#ff3d47',
    },
})(Rating);

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
export default function EventRater() {
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
   * Renders a form onclick that allows users to offer ratings and review for host based on event
   */
  return (
      <div>
      <IconButton onClick={handleClickOpen}>
        <RateReviewIcon />
      </IconButton>
      <Dialog open={dialogopen} onClose={handleClickClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Review and Rate [Host Name]'s Event!</DialogTitle>
        <DialogContent>
            <TextField
            autoFocus
            margin="dense"
            id="name"
            label="What was your experience like?"
            fullWidth/>

            <StyledRating
            name="customized-color"
            defaultValue={2}
            getLabelText={value => `${value} Heart${value !== 1 ? 's' : ''}`}
            precision={0.5}
            icon={<FavoriteIcon fontSize="inherit" />}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClickClose} color="primary">
            {/* TODO: ADD TO DB AND UPDATE/REMOVE EVENT FROM HISTORY */}
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      </div>
  );
}
