import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import EventForm from './EventForm';
import EventEdit from './EditEvent';
import EventDelete from './DeleteEvent';
import EventMessage from './MessageEvent';

const
    io = require("socket.io-client"),
    socket = io.connect("http://localhost:8000");

/**
 * @var useStyle Function object that generates a style off of default MaterialsUI Theme
 * @see https://material-ui.com/styles/basics/
 */
const styles = theme => ({
    root: {
        display: 'flex',
    },
    paperElement: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        height: "100%",
        
    },
    seeMore: {
        textAlign: 'center',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2)
    },
});

/**
 * React Component used to display and visualize table of events that the user is currently hosting
 * @author Phipson Lee
 * @date 02-19-2020
 */
class EventList extends Component {

    /**
     * Default constructor for initializing state
     * @param {Object} props 
     * @var hostEvents An array of events that the user is a part of (queried from mongoDB server)
     * @function resetList A helper function that re-renders the visual component whenever an event has been edited/created
     */
    constructor(props) {
        super(props);
        this.state = {
            hostEvents: [],
        }
        this.resetList = this.resetList.bind(this);
    };

    /**
     * called when the component is added to the DOM; we call resetList() to ensure that the component is updated
     */
    componentDidMount() {
        this.resetList();
    }

    /**
     * @function resetList Resets the view of the list of events based on whether an event has been edited or created
     */
    resetList() {
        console.log("Updating Table");
        let eventList = [];
        socket.emit('getAllEvents');

        socket.on('serverReply', (response) => {
            console.log(eventList);
            response.map((event) => {
                if (event.location) {
                    eventList.push({
                        id: event.eventID,
                        name: event.title, 
                        date: event.timeDate,
                        location: event.locationName,
                        attendees: 1,
                        host: event.host,
                        tag: event.tag,
                    })
                }
            });
            this.setState({
                hostEvents: eventList
            });
            
            eventList = []; // MUST CLEAR eventList before getting more events         
            console.log(this.state.hostEvents)
        });
    }

    render() {
    const { classes } = this.props;
    return (
            <Grid data-testid="Events" item xs={12}>
              <Paper className={classes.paper}>
              <React.Fragment>
              <EventForm updateFunction={this.resetList}/>
                    <Table size="small">
                    <TableHead>
                        <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Attendees</TableCell>
                        <TableCell align="right">Edit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.hostEvents.map(row => (
                        <TableRow data-testid="event-rows" key={row.id}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.location}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.attendees}</TableCell>
                            <TableCell align="right" style={{display: 'grid', gridTemplateRows: '1fr', gridTemplateColumns: '1fr 1fr 1fr'}}>
                                <EventEdit event={row} updateFunction={this.resetList}/>
                                <EventMessage event={row}/>
                                <EventDelete event={row}/>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                    <div className={classes.seeMore}>
                    <Link color="primary" href="#">
                        See more Events
                    </Link>
                    </div>
                </React.Fragment>
              </Paper>
            </Grid>     
    );
    }
};

export default withStyles(styles, {withTheme: true})(EventList);