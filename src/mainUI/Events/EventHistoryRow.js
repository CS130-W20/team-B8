import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EventRater from '../Rating/EventRater';
import EventCancel from '../Rating/EventCancel';


export default class EventHistoryRow extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        const{
            _id,
            title,
            timeDate,
            locationName,
            attendees,
            questions,
            tag,
            review,
            leaveEvent
        } = this.props;

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
                {review?
                <EventRater questions={questions}/>
                :
                <EventCancel leaveEvent={leaveEvent}/>}
            </TableCell>
        </TableRow>
        )
    }
}