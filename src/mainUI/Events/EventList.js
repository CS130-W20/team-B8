import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
const useStyles = makeStyles(theme => ({
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
}));

function preventDefault(event) {
    event.preventDefault();
  }

function createData(id, date, name, location, time, attendees) {
    return { id, date, name, location, time, attendees};
}

const rows = [
    createData(0, '16 Mar, 2019', 'Event A', 'Tupelo, MS', '6AM', 44),
    createData(1, '16 Mar, 2019', 'Event B', 'London, UK', '6AM', 99),
    createData(2, '16 Mar, 2019', 'Event C', 'Boston, MA', '6AM', 81),
    createData(3, '16 Mar, 2019', 'Event D', 'Gary, IN', '6AM', 39),
    createData(4, '15 Mar, 2019', 'Event E', 'Long Branch, NJ', '6AM', 79),
  ];



export default function EventList(props) {
    const classes = useStyles();
    const events = props.events; 
    return (
            <Grid item xs={12}>
              <Paper className={classes.paper}>
              <React.Fragment>
              <EventForm/>
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
                        {events.map(event => BMeetEventFactory.createEvent(event.type, event))}
                    </TableBody>
                    </Table>
                    <div className={classes.seeMore}>
                    <Link color="primary" href="#" onClick={preventDefault}>
                        See more Events
                    </Link>
                    </div>
                </React.Fragment>
              </Paper>
            </Grid>     
    );
};