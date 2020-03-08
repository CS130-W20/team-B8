import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EventEdit from './EditEvent';
import EventDelete from './DeleteEvent';
import EventMessage from './MessageEvent';
import {getTimeString, getDateString} from './EventClasses/formatTimeDate';


export default class EventListRow extends React.Component{

    render(){
        const{
            _id,
            title,
            timeDate,
            locationName,
            attendees,
            tag,
            type,
        } = this.props;

        let dateObj = new Date(timeDate);      

        const time = getTimeString(dateObj.getHours(), dateObj.getMinutes());
        const date = getDateString((dateObj.getMonth() + 1), dateObj.getDate(), dateObj.getFullYear());
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
                <EventEdit 
                    _id={_id} 
                    title={title} 
                    date={timeDate} 
                    location={location} 
                    tag={tag} 
                    type={type} 
                    updateFunction={this.props.updateFunction}
                    successAlert={this.props.successAlert}
                    failAlert={this.props.failAlert}/>
                <EventMessage notifyFunction={this.props.notifyFunction} 
                                socket={this.props.socket}
                                successAlert={this.props.successAlert}
                                failAlert={this.props.failAlert}/>
                <EventDelete />
            </TableCell>
            </TableRow>
        )
    }
}