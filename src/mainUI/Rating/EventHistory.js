import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import EventRater from './EventRater';

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

function preventDefault(event) {
    event.preventDefault();
}

/**
 * Helper function to display data of each event based on entry
 * @see  https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/dashboard
 * @param {Integer} id Unique id of event for internal use
 * @param {String} date Date of event in terms of DD/MM/YYYY
 * @param {String} name Name of Event
 * @param {String} location Location of Event
 * @param {String} time Time of event in AM/PM
 * @param {Integer} attendees Number of attendees for that event
 */
function createData(id, date, name, location, time, attendees) {
    return { id, date, name, location, time, attendees};
}

/**
 * @var rows Simple test data used to query and fetch events for display
 */
const rows = [
    createData(0, '16 Mar, 2019', 'Event A', 'Tupelo, MS', '6AM', 44),
    createData(1, '16 Mar, 2019', 'Event B', 'London, UK', '6AM', 99),
    createData(2, '16 Mar, 2019', 'Event C', 'Boston, MA', '6AM', 81),
    createData(3, '16 Mar, 2019', 'Event D', 'Gary, IN', '6AM', 39),
    createData(4, '15 Mar, 2019', 'Event E', 'Long Branch, NJ', '6AM', 79),
  ];

/**
 * Function component that uses Google Material UI Dialog Boxes
 * Uses IconButton to toggle display, and allows users to rate events they have attended
 * @see https://material-ui.com/components/dialogs/
 * @see https://material-ui.com/components/pickers/
 * @see EventRater
 * 
 * @author Phipson Lee
 * @since 2020-02-15
 */
class EventHistory extends React.Component{
    /**
     * @var classes Calls useStyles to generate CSS style inherited from Materials UI Theme
     */
    render = () => {
        const { classes, events, user, refreshEvents} = this.props;
        console.log("events: ", events)
    /**
     * Renders a table showing the events that the user has attended (currently using test data)
     */
    return (
            <Grid data-testid="Ratings" item xs={12}>
              <Paper className={classes.paper}>
              <React.Fragment>
                    <Table size="small">
                    <TableHead>
                        <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Attendees</TableCell>
                        <TableCell align="right">Review</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.length > 0 ? 
                            events.map(event => event.createEventHistoryRow(user["name"], refreshEvents)) :
                            <TableRow>
                                <TableCell align='center' colSpan='6'>
                                 <Typography style={{padding: '10px'}}align="center">{"You currently aren't attending any events"}</Typography>
                                </TableCell>
                            </TableRow>
                        }
                        {/* {rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.location}</TableCell>
                            <TableCell>{row.time}</TableCell>
                            <TableCell>{row.attendees}</TableCell>
                            <TableCell align="right">
                                <EventRater />
                            </TableCell>
                        </TableRow>
                        ))} */}
                    </TableBody>
                    </Table>
                    <div className={classes.seeMore}>
                    {/* <Link color="primary" href="#" onClick={preventDefault}>
                        See more Events
                    </Link> */}
                    </div>
                </React.Fragment>
              </Paper>
            </Grid>     
    );
    }
};

export default withStyles(styles, {withTheme: true})(EventHistory);