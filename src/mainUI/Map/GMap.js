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
            displayEvents: props.events,
            userLoc: props.updateLocation,
        }
        this.updateEventList = this.updateEventList.bind(this);
    }

    componentDidMount() {
        console.log('GMap log: ', this.props);
        this.updateEventList();
    }

    componentWillReceiveProps(prevProps) {
        console.log('GMap PrevProps: ', prevProps);
        console.log('GMap this.Props: ', this.props);
        if (this.props.events.length != prevProps.events.length){
            console.log('Found difference!')
            this.updateEventList(prevProps);
        }
    }

    updateEventList(prevProps) {
        if (prevProps == null)
            prevProps = this.props;
        
        var eventList = [];
        prevProps.events.forEach(event => {
            eventList.push(event);
        });

        this.setState({
            displayEvents: eventList,
            userLoc: this.props.updateLocation
        })

        console.log(this.state);

        eventList = [];
    }

    render() {
        console.log('GMAP: ', this.state.displayEvents)
        const {classes} = this.props;
        return(
            <Grid data-testid="Map" container spacing={3} style={{height: "80vh"}}>
                {/* Map */}
                <Grid item xs={12} md={8} lg={9} style={{height: "100%"}}>
                    <Paper className={classes.paperElement}>
                        <SimpleMap updateLocation={this.state.userLoc} events={this.state.displayEvents}/>
                    </Paper>
                </Grid>
                {/* Map Settings? */}
                <Grid item xs={12} md={4} lg={3}>
                    <Paper className={classes.paperElement}>
                        <GMapFilter updateFilter={(filter) => {this.props.refreshFunction(filter)}}/>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, {withTheme: true})(GMap);