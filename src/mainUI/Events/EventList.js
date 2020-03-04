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

import BMeetEventFactory from './EventFactory';

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
            hostEvents: props.events,
        }
    };

    /**
     * called when the component is added to the DOM; we call resetList() to ensure that the component is updated
     */
    componentDidMount() {
        this.setState({
            hostEvents: this.props.events,
        });
    }

    render() {
    const { classes, events, refreshEvents } = this.props;
    return (
            <Grid data-testid="Events" item xs={12}>
              <Paper className={classes.paper}>
              <React.Fragment>
              <EventForm updateFunction={refreshEvents}/>
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
                        {events.map(event => event.createEventListRow(refreshEvents))}
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