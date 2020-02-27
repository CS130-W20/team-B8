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
    constructor(props) {
        super(props);
        this.state = {
            filters: {
                eventTypes: ["Food"],
                eventDistance: 1,
            }
        }
        this.updateFilter = this.updateFilter.bind(this);
    }

    updateFilter = newFilters => {
        this.setState({
            filters: newFilters
        });
    }

    render() {
        const {classes} = this.props;
        return(
            <Grid data-testid="Map" container spacing={3} style={{height: "80vh"}}>
                {/* Map */}
                <Grid item xs={12} md={8} lg={9} style={{height: "100%"}}>
                    <Paper className={classes.paperElement}>
                        <SimpleMap mapFilters={this.state.filters}/>
                    </Paper>
                </Grid>
                {/* Map Settings? */}
                <Grid item xs={12} md={4} lg={3}>
                    <Paper className={classes.paperElement}>
                        <GMapFilter updateFilter={this.updateFilter}/>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, {withTheme: true})(GMap);