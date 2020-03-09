import React from 'react';
import { DialogContent } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import PersonIcon from '@material-ui/icons/Person';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Rating from '@material-ui/lab/Rating';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const fontStyle = {
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: '0.875rem',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontWeight: '400',
    lineHeight: '1.43',
    letterSpacing: '0.01071em',
}

const StyledRating = withStyles({
    iconFilled: {
      color: '#ff6d75',
    },
    iconHover: {
      color: '#ff3d47',
    },
})(Rating);

class EventReviewRow extends React.Component{
    getStyle = () => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // paddingTop: '2px',
        // paddingBottom: '3px',
        // fontSize: '12px',
        // border: '1px solid grey',
        // boxShadow: '1px 1px grey'
    });
    render = () => {
        const {
            rating,
            review,
            user,
            event
        } = this.props;
        return (
            <ExpansionPanel>
                <ExpansionPanelSummary 
                    style={this.getStyle()}
                    expandIcon={<ExpandMoreIcon />}
                >
                <StyledRating
                name="custom-color"
                value={rating}
                getLabelText={value => `${value} Heart${value !== 1 ? 's' : ''}`}
                precision={0.5}
                icon={<FavoriteIcon fontSize="inherit" />}
                disabled={true}
                style={{marginRight: '5px'}}
                />
                <span>{"by " + user + " for "}<i>{event}</i></span>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{flexDirection: 'column'}}>
                    {Object.keys(review).map(question => (
                    <div style={{marginBottom: '5px'}}key={question}>
                        <b>{question} </b>
                        {review[question]}
                    </div>
                    ))}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

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
            <div style={{display: 'flex', flexDirection: 'column', backgroundColor: '#fc5185', height: '40px', width: '40px', borderRadius: '0px', alignItems: 'center', marginRight: '10px'}}>
                <span style={{fontSize: '10px', color: 'white'}}> {monthStr} </span>
                <span style={{fontSize: '14px', color: 'black'}}> {date} </span>
            </div>
        )
    }
}

class EventPageItem extends React.Component{
    pageItemStyle = () => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: '2px',
        paddingBottom: '3px',
        borderBottom: '1px solid grey',
        ...fontStyle
    });
    render = () => (
        <Typography style={this.pageItemStyle()} gutterBottom>
            <div style={{marginRight: '10px'}}> {this.props.children[0]} </div>
            {this.props.children[1]}
            {this.props.children.length > 2 && this.props.children[2]}
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
        padding: '0px',
    });

    getEventPageStyle = () => ({
        backgroundColor: 'white', 
        height: '800px',
        maxHeight: 'calc(90vh - 150px)', 
        overflowY: 'scroll',
        width: '500px',
    });

    getImageContainerStyle = () => ({
        width: '500px',
        height: 'auto',
        overflow: 'hidden',
        marginBottom: '5px',
    })
    getImageStyle = () => ({
        height: 'auto',
        width: '500px',
    });

    getDescriptionStyle = () => ({
        padding: '5px',
        width: '100%',
        overflowY: 'scroll',
        maxHeight: '60px',
        borderBottom: '1px solid gray',
        marginBottom: '5px',
        ...fontStyle
    })

    render = () => {
        const {
            currEvent,
            avgScore,
            reviews
        } = this.props;
        

        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
        
        const eventDate = new Date(currEvent.timeDate);
        const dayOfWeek = days[eventDate.getDay()];
        const date = eventDate.getDate();
        const month = months[eventDate.getMonth()];
        var year = eventDate.getFullYear();
        var hour = eventDate.getHours() % 12;
        hour = hour === 0 ? 12 : hour;
        var minutes = eventDate.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const AMPM = eventDate.getHours() < 12 ? "AM" : "PM";
        const dateString = `${dayOfWeek}, ${month} ${date}, ${year} at ${hour}:${minutes} ${AMPM} `;
        return (
        <div>
        <DialogTitle style={this.getTitleStyle()} id="form-dialog-title">
            <div style ={ this.getTitleStyle()}>
            <CalendarDate month={eventDate.getMonth()} date={eventDate.getDate()}/>
            <div style={{marginLeft: '10px'}}> {currEvent.title} </div>
            </div>
        </DialogTitle>
        <DialogContent>
        <div style={this.getEventPageStyle()}>
            {currEvent.image && 
            <div style={this.getImageContainerStyle()}>
            <img style={this.getImageStyle()} alt={"Event image can't be displayed"}  src={'data:image/jpeg;base64,' + currEvent.image}/>
            </div>
            }
            <div style={this.getDescriptionStyle()}>
                {currEvent.description}
            </div>
            <EventPageItem>
                <QueryBuilderIcon color={"grey"} fontSize={'small'}/>
                {dateString}
            </EventPageItem>
            <EventPageItem>
                <LocationOnIcon color={"grey"} fontSize={'small'}/>
                {currEvent.locationName}
            </EventPageItem>
            <EventPageItem>
                <PersonIcon color={"grey"} fontSize={'small'}/>
                {"Hosted by " + currEvent.host.name}
                <StyledRating
                name="custom-color"
                value={avgScore}
                getLabelText={value => `${value} Heart${value !== 1 ? 's' : ''}`}
                precision={0.1}
                icon={<FavoriteIcon fontSize="small" />}
                disabled={true}
                style={{marginLeft: '5px'}}
                />
            </EventPageItem>
            <EventPageItem>
                <PeopleOutlineIcon color={"grey"} fontSize={'small'}/>
                {currEvent.attendees.length + (currEvent.attendees.length === 1 ? " person going" : "  people going")}
            </EventPageItem>
            {/*<div style={{fontWeight: 'bold', padding: '10px', borderBottom: '1px solid gray'}}> {'Reviews of this host:'} </div>*/}
            {reviews.map((reviewObj, index) => {
                const {
                    rating,
                    review,
                    user,
                    event 
                } = reviewObj;
                return <EventReviewRow rating={rating} review={JSON.parse(review)} user={user} event={event}/>
            })}
            {/*             
            {events.length > 0 && 
            <div className={classes.seeMore}>
                    <Link color="primary" href="#">
                        See more reviews
                    </Link>
            </div>} */}
        </div>
        </DialogContent>
        </div>
        );
    }
}