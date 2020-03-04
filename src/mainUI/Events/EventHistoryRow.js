import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EventReview from '../Rating/EventReview';
import EventRater from '../Rating/EventRater';


export default class EventHistoryRow extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userReview: props.userReview
        }
    }

    submitReview = (rating, review) => {
        const {
            user,
            refreshEvents,
        } = this.props
        this.props.submitReview(user, rating, review, refreshEvents);
        this.setState({
            userReview: {user: user, score: rating, review: review}
        });
    }

    render(){
        const{
            _id,
            title,
            timeDate,
            locationName,
            attendees,
            host,
            questions,
            submitReview,
            tag,
        } = this.props;

        const userReview = this.state.userReview;

        let dateObj = new Date(timeDate);
        const time = dateObj.getHours() + ":" + dateObj.getMinutes();
        const date = (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
        const location = locationName.slice(0, locationName.indexOf(','));
        const numAttendees = attendees.length;

        return (
        <TableRow key={_id}>
            <TableCell>{date}</TableCell>
            <TableCell>{title}</TableCell>
            <TableCell>{location}</TableCell>
            <TableCell>{time}</TableCell>
            <TableCell>{numAttendees}</TableCell>
            <TableCell align="right">
                {userReview ? 
                    <EventReview rating={userReview.score} review={JSON.parse(userReview.review)} user={userReview.user} id={_id}/>
                    :
                    <EventRater questions={questions} host={host} submitReview={this.submitReview}/>
                }
            </TableCell>
        </TableRow>
        )
    }
}