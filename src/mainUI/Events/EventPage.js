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
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Rating from '@material-ui/lab/Rating';
import { withStyles } from '@material-ui/core/styles';

const StyledRating = withStyles({
    iconFilled: {
      color: '#ff6d75',
    },
    iconHover: {
      color: '#ff3d47',
    },
})(Rating);

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
            <div style={{display: 'flex', flexDirection: 'column', backgroundColor: 'white', height: '40px', width: '40px', borderRadius: '5px', alignItems: 'center', marginRight: '10px'}}>
                <span style={{fontSize: '10px', color: 'red'}}> {monthStr} </span>
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
        fontSize: '12px',
        borderBottom: '1px solid grey'
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
        padding: '3px',
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
        height: '200px',
        overflow: 'hidden',
        marginBottom: '5px',
    })
    getImageStyle = () => ({
        height: 'auto',
        width: '500px',
    });

    getDescriptionStyle = () => ({
        fontSize: '12px',
        padding: '5px',
        width: '100%',
        overflowY: 'scroll',
        maxHeight: '60px',
        borderBottom: '1px solid gray',
        marginBottom: '5px',
    })

    render = () => {
        const {
            currEvent
        } = this.props;
        
        console.log('current event:', currEvent)

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
            {currEvent.image && 
            <div style={this.getImageContainerStyle()}>
            <img style={this.getImageStyle()} src={'data:image/jpeg;base64,' + currEvent.image}/>
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
            </EventPageItem>
            <EventPageItem>
                <PeopleOutlineIcon color={"grey"} fontSize={'small'}/>
                {currEvent.attendees.length + (currEvent.attendees.length === 1 ? " person going" : "  people going")}
            </EventPageItem>
            {currEvent.reviews.map((review,index) => (
                <StyledRating
                  name={'rating-' + index }
                  value={review.score}
                  getLabelText={value => `${value} Heart${value !== 1 ? 's' : ''}`}
                  precision={0.5}
                  icon={<FavoriteIcon fontSize="inherit" />}
                  disabled={true}
                />
            ))}
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