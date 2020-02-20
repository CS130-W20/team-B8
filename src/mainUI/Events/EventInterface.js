import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EventEdit from './EditEvent';
import EventDelete from './DeleteEvent';
import EventMessage from './MessageEvent';

// BMeetEvent: A base class type that is used to generate event objects
// Uses an observer pattern to notify and update attendees of event changes
export class BMeetEvent extends React.Component {
    constructor(props) {
        super(props);
        this.m_eventID = props._id;
        this.m_title =  props.title;
        this.m_timeDate = props.timeDate;
        this.m_tags = props.tags;
        this.m_location = props.location;
        this.m_host =  props.host;
        this.m_attendees = [];
        this.m_ratings = [];
    }

    registerUser(user) {
        this.m_attendees.push(user);
    }

    removeUser(id) {
        var oldList = this.m_attendees;
        var removeIndex = oldList.map(function(item) { return item.state.m_ID; }).indexOf(id);
        this.m_attendees.splice(removeIndex, 1);
    }

    notifyUsers() {
        this.m_attendees.forEach(element => {
            console.log(element);
            element.update();
        })
    }

    render(){
        const{
            _id,
            title,
            timeDate,
            locationName,
            attendees
        } = this.props;

        let dateObj = new Date(timeDate);
        const time = dateObj.getHours() + ":" + dateObj.getMinutes();
        const date = dateObj.getMonth() + "-" + dateObj.getDate();
        const location = locationName.slice(0, locationName.indexOf(','));
        const numAttendees = attendees.length;

        return (
            <TableRow key={_id}>
            <TableCell>{date}</TableCell>
            <TableCell>{title}</TableCell>
            <TableCell>{location}</TableCell>
            <TableCell>{time}</TableCell>
            <TableCell>{numAttendees}</TableCell>
            <TableCell align="right" style={{display: 'grid', gridTemplateRows: '1fr', gridTemplateColumns: '1fr 1fr 1fr'}}>
                <EventEdit />
                <EventMessage/>
                <EventDelete />
            </TableCell>
            </TableRow>
        )
    }
}