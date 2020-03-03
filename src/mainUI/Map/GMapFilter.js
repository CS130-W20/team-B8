import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { eventTypes } from './../markerPrefab/mapMarker';
import update from 'react-addons-update'; // ES6

const styles = theme => ({
    root: {
        padding: "5%",
        width: "100%",
        height: "100%",
    },
    margin: {
      height: theme.spacing(3),
    },
    toggleContainer: {
        margin: theme.spacing(2, 0),
        width: "100%",
        justifyContent: "center"
      },
    typography: {
        fontSize: 10
    }
  });
  
  const marks = [
    {
      value: 1,
      label: '1km',
    },
    {
      value: 2,
      label: '2km',
    },
    {
      value: 3,
      label: '3km',
    },
    {
      value: 4,
      label: '4km',
    },
    {
        value: 5,
        label: '5km',
    }
  ];

  
function valuetext(value) {
    return `${value}km`;
}

function valueLabelFormat(value) {
    return marks.findIndex(mark => mark.value === value) + 1;
}
  
/**
 * @see https://material-ui.com/components/toggle-button/
 * @see https://material-ui.com/components/slider/
 */
class GMapFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            eventTypes: [eventTypes.music],
            eventDistance: 1,
        }
        this.handleType = this.handleType.bind(this);
        this.handleDistance = this.handleDistance.bind(this);
    }

    handleType = (event, newTypes) => {
        if (newTypes.length) {
            console.log('GMapFilter newTypes: ', newTypes);
            this.setState({
                eventTypes: newTypes,
            }, () => {
                console.log('GMapFilter updatedTypes:', this.state.eventTypes);
                this.props.updateFilter(this.state);
            });
        }
    }

    handleDistance = (event, newVal) => {
        if (newVal != this.state.eventDistance) {
            this.setState({
                eventDistance: newVal,
            }, () => {
                this.props.updateFilter(this.state);
            }
            );
        }
    }

  
    render() {
        const { classes } = this.props;
        return (
        <div className={classes.root}>
            <Typography id="discrete-slider-always" style={{paddingBottom: 30}}gutterBottom>
            Distance
            </Typography>
            <Slider
                value={this.state.eventDistance}
                onChange={this.handleDistance}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider-always"
                step={1}
                marks={marks}
                valueLabelDisplay="on"
                min={1}
                max={5}
            />
            <Typography id="discrete-slider-always" style={{paddingTop: 10}}gutterBottom>
            Event Types
            </Typography>
            <div className={classes.toggleContainer}>
            <ToggleButtonGroup
                value={this.state.eventTypes} 
                onChange={this.handleType}
                aria-label="eventFilters"
                style={{width: "100%", justifyContent: "center"}}
            >
                <ToggleButton value={eventTypes.barHopping} aria-label={eventTypes.barHopping}>
                <Typography className={classes.typography}>Bars</Typography>
                </ToggleButton>
                <ToggleButton value={eventTypes.rave} aria-label={eventTypes.rave}>
                    <Typography className={classes.typography}>Raves</Typography>
                </ToggleButton>
                <ToggleButton value={eventTypes.houseParty} aria-label={eventTypes.houseParty}>
                    <Typography className={classes.typography}>Party</Typography>
                </ToggleButton>
                <ToggleButton value={eventTypes.music} aria-label={eventTypes.music}>
                    <Typography className={classes.typography}>Music</Typography>
                </ToggleButton>
            </ToggleButtonGroup>
            </div>
        </div>
        );
    }
  }

export default withStyles(styles, {withTheme: true})(GMapFilter);