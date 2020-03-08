import React from 'react';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Rating from '@material-ui/lab/Rating';
import { withStyles } from '@material-ui/core/styles';

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

export default class EventReview extends React.Component{

    render = () => {
        const {
            rating,
            review 
        } = this.props;
    return(
        <div>
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
    </div>);
    }

}