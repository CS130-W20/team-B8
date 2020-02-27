import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

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
            eventTypes: ['Food'],
            eventDistance: 1,
        }
        this.handleType = this.handleType.bind(this);
        this.handleDistance = this.handleDistance.bind(this);
    }

    handleType = (event, newTypes) => {
        if (newTypes.length) {
            this.setState({
                eventTypes: newTypes,
            });
            this.props.updateFilter(this.state);
        }
    }

    handleDistance = (event, newVal) => {
        this.setState({
            eventDistance: newVal,
        })
        this.props.updateFilter(this.state);
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
                aria-label="text alignment"
                style={{width: "100%", justifyContent: "center"}}
            >
                <ToggleButton value="left" aria-label="left aligned">
                <Typography className={classes.typography}>Food</Typography>
                </ToggleButton>
                <ToggleButton value="center" aria-label="centered">
                    <Typography className={classes.typography}>Raves</Typography>
                </ToggleButton>
                <ToggleButton value="right" aria-label="right aligned">
                    <Typography className={classes.typography}>Drinks</Typography>
                </ToggleButton>
                <ToggleButton value="justify" aria-label="justified">
                    <Typography className={classes.typography}>Music</Typography>
                </ToggleButton>
            </ToggleButtonGroup>
            </div>
        </div>
        );
    }
  }

export default withStyles(styles, {withTheme: true})(GMapFilter);