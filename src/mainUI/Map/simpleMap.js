import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { markerTypes } from './../markerPrefab/mapMarker';
import Dimensions from 'react-dimensions';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

/**
* SimpleMap is a ReactJS Component that displays events on a google map
* Uses Google Maps API and will also integrate Google Places API for directions
*
* @author  Phipson Lee
* @since   2020-02-18
*/
class SimpleMap extends Component {

/**
 * Default constructor for component, as with all ReactJS Components
 * SimpleMap uses state.markers as a method of tracking the events declared
 * Also uses state.open to maintain UI for whether a marker has been clicked.
 * Also uses state.userLocation and state.loading to determine user's GPS position
 * 
 * Constructor also uses Google Maps API to fetch user's current location.
 * @param props This is a key-value object that is maintained to pass arguments
 * on construction
 * @see google-maps-react For more information on navigator.geolocation
 * @see markerTypes
 */
    constructor(props){
      super(props);
      this.current = React.createRef();
      this.state = {
          markers: [],
          open: false,
    }
    
    this.addMarker = this.addMarker.bind(this);
    this.filterMarkers = this.filterMarkers.bind(this);
    this.handleClickClose = this.handleClickClose.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        this.setState({
          userLocation: { lat: latitude, lng: longitude },
          loading: false
        });
      },
      () => {
        this.setState({ loading: false });
      }
    );
  }

/**
 * Sets the state of the component when it mounts. Default function that is available for all reactJS components
 * In this case, for testing purposes, we have defined a set of markers based on markerTypes
 * @see markerTypes from './../markerPrefab/mapMarker'
 */
  componentDidMount() {
    this.setState({
      markers: [
        {"name" : "Test 1", "lat": 34.06, "lng": -118.45, "type": markerTypes.gaming},
        {"name" : "Test 2", "lat": 34.07, "lng": -118.44, "type": markerTypes.food},
        {"name" : "Test 3", "lat": 34.06, "lng": -118.44, "type": markerTypes.dj},
        {"name" : "Test 4", "lat": 34.06, "lng": -118.46, "type": markerTypes.dance},
      ],
    })
  }

/**
 * Adds a marker to this.state.markers list. To be displayed on the maps on render.
 * @param {Object} value  Dictionary object that holds name, position, and type of marker to be placed.
 */
  addMarker(value) {
    this.setState({
      markers: this.markers.push(value)
    });
  }

  /**
   * Filters out the markers to be displayed on the maps, based on user query and filtering
   * @param {String} query 
   */
  // TODO: Change rendered markers based on filters
  filterMarkers(query) {
    
  }

  /**
   * Event function that will be used for detecting button click and display event details
   */
  handleClickOpen() {
    this.setState({
      open: true,
    })
  };

  /**
   * Event function that will be used for detecting 'Cancel' option to close/hide event details
   */
  handleClickClose() {
    this.setState({
      open: false,
    })
  };

  /**
   * Helper function to render marker based on this.state.markers
   * @param {Object} marker A marker object from this.state.markers
   * @param {Integer} index Specify a unique key value for component
   */
  renderMarker(marker, index) {
    return(
      <Marker 
        position={{ lat: marker.lat, lng: marker.lng}}
        name={marker.name}
        id={index}
        key={index}
        type={marker.type}/>
    )
  }

  /**
   * Default function to load and display component on DOM
   * Renders Google Map and also a hidden Dialog/popup that will show event details when a user clicks on a marker
   */
  render() {
    const { loading, userLocation } = this.state;

    if (loading) {
      return null;
    }

    return (
      <div>
        <Map
          google={this.props.google}
          zoom={15}
          style={{
            width: this.props.containerWidth,
            height: this.props.containerHeight
          }}
          center={ userLocation }>
          <Marker
          position={userLocation}/>
          {this.state.markers.map((marker, i) =>{
                //console.log(i);
                //this.renderMarker(marker, i);
                return(
                  <Marker
                    onClick={this.handleClickOpen}
                    position={{ lat: marker.lat, lng: marker.lng}}
                    name={marker.name}
                    key={i}
                    icon={{url: marker.type, scaleSize: (.5, .5)}}/>
                )
          })}
        </Map>
        <Dialog open={this.state.open} onClose={this.handleClickClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Event Name</DialogTitle>
                <DialogContent>
                <Typography gutterBottom>
                    Event Details
                </Typography>
                <Typography gutterBottom>
                    Event Host
                </Typography>
                <Typography gutterBottom>
                    Event Description
                </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClickClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleClickClose} color="primary">
                        {/* TODO: ADD TO DB AND UPDATE */}
                        Attend
                    </Button>
                    <Button onClick={this.handleClickClose} color="primary">
                        {/* TODO: ADD TO DB AND UPDATE */}
                        Message Host
                    </Button>
                </DialogActions>
          </Dialog>
      </div>
    );
  }
}

// Add API Key as String
// AIzaSyD2EzcDG507GgPgPHVEoVpgFngvsMGIElg
export default Dimensions({elementResize: true, className: 'react-dimensions-wrapper'})(GoogleApiWrapper({
  apiKey: "AIzaSyD2EzcDG507GgPgPHVEoVpgFngvsMGIElg"
})(SimpleMap));
