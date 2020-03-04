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
 * @author Lawrence Lee
 * @since 2020-02-15
 */
export default class EventReview extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      dialogopen: false,
    }
  }

  /**
   * @var handleClickOpen Function that sets the dialog box to close
   */
    handleClickOpen = () => {
        this.setState({dialogopen: true});
    };

  /**
   * @var handleClickClose Function that sets the dialog box to close
   */
    handleClickClose = () => {
        this.setState({dialogopen: false});
    };
    handleRatingChange = (e, newRating) => {
      this.setState({rating: newRating});
    }

    handleTextChange = (label, e) => {
      let currentReview = this.state.review;
      currentReview[label] = e.target.value;
      this.setState({review: currentReview});
    }

  render = () => {
  /**
   * Renders a form onclick that allows users to offer ratings and review for host based on event
   */
  const { id, rating, review, user } = this.props;

  return (
      <div>
      <div style={{cursor: 'pointer', textAlign: 'left', float: 'right'}}onClick={this.handleClickOpen}>
      <StyledRating
        name={'rating-' + id}
        value={rating}
        getLabelText={value => `${value} Heart${value !== 1 ? 's' : ''}`}
        precision={0.5}
        icon={<FavoriteIcon fontSize="inherit" />}
        disabled={true}
      />
      </div>
      <Dialog open={this.state.dialogopen} onClose={this.handleClickClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{"Reviewed by " + user}</DialogTitle>
        <DialogContent>
            <StyledRating
                name="custom-color"
                value={rating}
                getLabelText={value => `${value} Heart${value !== 1 ? 's' : ''}`}
                precision={0.5}
                icon={<FavoriteIcon fontSize="inherit" />}
                disabled={true}
            />
          {Object.keys(review).map(question => (
            <div key={question}>
                <b>{question} </b>
                {review[question]}
            </div>
          ))}

        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClickClose} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
      </div>
  );
  
}
}
