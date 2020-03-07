import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

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
        const { classes, eventsPast, eventsFuture, userID, socket, refreshEvents } = this.props;
        console.log(eventsPast);
        console.log(eventsFuture);
    /**
     * Renders a table showing the events that the user has attended (currently using test data)
     */
    return (
            <Grid data-testid="Ratings" item xs={12}>
              <Paper className={classes.paper}>
              <React.Fragment>
                    <Typography style={{padding: '1.5%'}} component="h2" variant="h6" color="primary" gutterBottom>
                        Your Upcoming Events
                    </Typography>
                    <Table size="small">
                    <TableHead>
                        <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Attendees</TableCell>
                        <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {eventsFuture.map(event => event.createEventHistoryRow(userID, socket, false, refreshEvents))}
                    </TableBody>
                    </Table>
                </React.Fragment>
                <div style={{padding: 20}}/>
                <React.Fragment>
                    {/* TODO: After rating an event, remove the user from the event */}
                    <Typography style={{padding: '1.5%'}} component="h2" variant="h6" color="primary" gutterBottom>
                        Your Previous Events
                    </Typography>
                    <Table size="small">
                    <TableHead>
                        <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Attendees</TableCell>
                        <TableCell align="right">Reviews</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {eventsPast.map(event => event.createEventHistoryRow(userID, socket, true, refreshEvents))}
                    </TableBody>
                    </Table>
                </React.Fragment>
                <div style={{padding: 20}}/>
              </Paper>
            </Grid>     
    );
    }
};

export default withStyles(styles, {withTheme: true})(EventHistory);