import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SimpleMap from './simpleMap';
import { withStyles } from '@material-ui/core/styles';
import GMapFilter from './GMapFilter';


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
    }
});

class GMap extends Component {
    render() {
        const {classes, events, updateLocation, updateFilter, refreshMap, socket, userID} = this.props;
        console.log('GMap events: ', events);
        return(
            <Grid data-testid="Map" container spacing={3} style={{height: "80vh"}}>
                {/* Map */}
                <Grid item xs={12} md={8} lg={9} style={{height: "100%"}}>
                    <Paper className={classes.paperElement}>
                        <SimpleMap updateLocation={updateLocation} 
                                   events={events}
                                   refreshMap={refreshMap}
                                   socket={socket}
                                   userID={userID}
                                   successAlert={this.props.successAlert}
                                   failAlert={this.props.failAlert}/>
                    </Paper>
                </Grid>
                {/* Map Settings? */}
                <Grid item xs={12} md={4} lg={3}>
                    <Paper className={classes.paperElement}>
                        <GMapFilter updateFilter={updateFilter}/>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, {withTheme: true})(GMap);