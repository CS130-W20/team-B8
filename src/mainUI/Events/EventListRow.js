import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EventEdit from './EditEvent';
import EventDelete from './DeleteEvent';
import EventMessage from './MessageEvent';


export default class EventListRow extends React.Component{
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
            tag,
            type,
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
            <TableCell align="right" style={{display: 'grid', gridTemplateRows: '1fr', gridTemplateColumns: '1fr 1fr 1fr'}}>
                <EventEdit 
                    _id={_id} 
                    title={title} 
                    date={timeDate} 
                    location={location} 
                    tag={tag} 
                    type={type} 
                    updateFunction={this.props.updateFunction}/>
                <EventMessage/>
                <EventDelete />
            </TableCell>
            </TableRow>
        )
    }
}