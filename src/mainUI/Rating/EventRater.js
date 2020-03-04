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
export default class EventRater extends React.Component{

  constructor(props){
    super(props);
    let initialReview = {};
    this.props.questions.map(question => initialReview[question.label] = "")
    this.state = {
      dialogopen: false,
      review: initialReview,
      rating: 2,
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

    handleClickSubmit = () => {
      let reviewString = JSON.stringify(this.state.review)
      // Object.keys(this.state.review)
      //                 .map(question => question + this.state.review[question])
      //                 .join('&');
      this.props.submitReview(this.state.rating, reviewString);
      this.handleClickClose();
    }

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
  const { questions, host} = this.props;

  return (
      <div>
      <IconButton onClick={this.handleClickOpen}>
        <RateReviewIcon />
      </IconButton>
      <Dialog open={this.state.dialogopen} onClose={this.handleClickClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{"Review and Rate " + host + "'s Event!"}</DialogTitle>
        <DialogContent>
          <StyledRating
              name="customized-color"
              defaultValue={2}
              getLabelText={value => `${value} Heart${value !== 1 ? 's' : ''}`}
              precision={0.5}
              onChange={this.handleRatingChange}
              icon={<FavoriteIcon fontSize="inherit" />}
              />
          {questions.map(question => (
            <TextField
              autoFocus
              margin="dense"
              key={question.id}
              id={question.id}
              label={question.label}
              //value={this.state.review[question.label]}
              onChange={(newText) => { this.handleTextChange(question.label, newText)}}
              fullWidth/>
          ))}

        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClickClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleClickSubmit} color="primary">
            {/* TODO: ADD TO DB AND UPDATE/REMOVE EVENT FROM HISTORY */}
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      </div>
  );
  
}
}
