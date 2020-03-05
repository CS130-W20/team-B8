import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { DialogContent } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import PersonIcon from '@material-ui/icons/Person';

class CalendarDate extends React.Component{
    monthToStr = (month) => {
        switch(month){
            case 0:
                return 'JAN'
            case 1:
                return 'FEB'
            case 2:
                return 'MAR'
            case 3:
                return 'APR'
            case 4:
                return 'MAY'
            case 5:
                return 'JUNE'
            case 6:
                return 'JULY'
            case 7:
                return 'AUG'
            case 8:
                return 'SEPT'
            case 9:
                return 'OCT'
            case 10:
                return 'NOV'
            case 11:
                return 'DEC'
            default:
                return ''
        }
    }
    render = () => {
        const monthStr = this.monthToStr(this.props.month)
        const date = this.props.date;
        return (
            <div style={{display: 'flex', flexDirection: 'column', backgroundColor: 'white', height: '50px', width: '50px', borderRadius: '5px', alignItems: 'center', marginRight: '10px'}}>
                <span style={{fontSize: '12px', color: 'red'}}> {monthStr} </span>
                <span style={{fontSize: '18px', color: 'black'}}> {date} </span>
            </div>
        )
    }
}

class EventPageItem extends React.Component{
    pageItemStyle = () => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: '5px',
        paddingBottom: '5px',
    });
    render = () => (
        <Typography style={this.pageItemStyle()} gutterBottom>
            <div style={{marginRight: '10px'}}> {this.props.children[0]} </div>
            {this.props.children[1]}
        </Typography>
    );
}

export default class EventPage extends React.Component{

    getTitleStyle = () => ({
        backgroundColor: '#6a2c70',
        color: 'white',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    });

    getEventPageStyle = () => ({
        backgroundColor: 'white', 
        height: '500px',
        maxHeight: 'calc(90vh - 200px)', 
        overflowY: 'scroll',
        width: '500px',
    });

    getImageStyle = () => ({
        height: 'auto', 
        width: '500px'
    });

    render = () => {
        const {
            currEvent
        } = this.props;

        const eventDate = new Date(currEvent.timeDate);
        const dateString = "Sunday, April 26, 2020 at 8 AM – 12 PM";
        return (
        <div>
        <DialogTitle style={this.getTitleStyle()} id="form-dialog-title">
            <div style ={ this.getTitleStyle()}>
            <CalendarDate month={eventDate.getMonth()} date={eventDate.getDate()}/>
            {currEvent.title}
            </div>
        </DialogTitle>
        <DialogContent>
        <div style={this.getEventPageStyle()}>
            <img style={this.getImageStyle()} src={"https://media1.s-nbcnews.com/j/newscms/2018_39/1371648/snickers-today-main-180928_4cde44fa22fddd80622982a044bb5709.fit-760w.jpg"}/>
            <EventPageItem>
                <QueryBuilderIcon color={"grey"}/>
                {dateString}
            </EventPageItem>
            <EventPageItem>
                <LocationOnIcon color={"grey"}/>
                {currEvent.locationName}
            </EventPageItem>
            <EventPageItem>
                <PersonIcon color={"grey"}/>
                {"Hosted by " + currEvent.host.name}
            </EventPageItem>
        </div>
        </DialogContent>
        </div>
        );
    }
}