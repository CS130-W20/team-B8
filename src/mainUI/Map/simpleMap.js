import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { getMarkerType, markerTypes } from './../markerPrefab/mapMarker';
import Dimensions from 'react-dimensions';
import Dialog from '@material-ui/core/Dialog';
import { DialogContent } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Geocode from "react-geocode";
import { getDistance } from 'geolib';

const
    io = require("socket.io-client"),
    socket = io.connect("http://localhost:8000");

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
          currEvent: {},
          filters: this.props.mapFilters,
    }
    
    this.addMarker = this.addMarker.bind(this);
    this.filterMarkers = this.filterMarkers.bind(this);
    this.handleClickClose = this.handleClickClose.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.resetMap = this.resetMap.bind(this);
    this.filterMarkers = this.filterMarkers.bind(this);

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
 * In particular, we will get all events and then push them onto a buffer before updating our state
 * this.state.markers will then be rendered on the DOM
 */
componentDidMount() {
  this.resetMap();
}

componentDidUpdate(prevProps) {
  console.log(prevProps);
  console.log(this.props);
  if (this.props.userLocation != null && this.props.mapFilters != null) {
    if (this.props.mapFilters.eventDistance != prevProps.mapFilters.eventDistance) {
      if (this.props.mapFilters.eventTypes.length != prevProps.mapFilters.eventTypes.length) {
        this.resetMap();
      }

      for (var i = 0; i < this.props.filters.eventTypes.length; i++) {
        if (this.props.filters.eventTypes[i] != prevProps.filters.eventTypes[i]) {
          this.resetMap();
        }
      }
    }
  }
}

resetMap() {
  var markerList = []
    socket.emit('getAllEvents'); // TODO: Query by tags

    socket.on('serverReply', (response) => {
      console.log("serverReply: ", response);
      response.map(event => {
        if (event.location) {
          markerList.push({
            name: event.title,
            lat: event.location.lat,
            lng: event.location.lng,
            type: event.tag[0],
            dateTime: event.dateTime,
            description: 'new event!',
            locationName: event.LocationName,
            host: event.host
          })
        }
      });

      var filteredEvents = this.filterMarkers(markerList);

      this.setState({
        markers: filteredEvents
      });

      markerList = [];
    });
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
   */
  filterMarkers(eventList) {
    var finalList = [];
    eventList.map(event => {
        var currposition = {latitude: this.state.userLocation.lat,
                            longitude: this.state.userLocation.lng};
        var dist = getDistance(currposition, 
          {
            latitude: event.lat,
            longitude: event.lng
          });
        
        if (dist <= this.state.filters.eventDistance * 1000) {
          console.log('You are ', dist, ' meters away from event');
          finalList.push(event);
        }
    });

    console.log(finalList);
    return finalList;
  }

  /**
   * Event function that will be used for detecting button click and display event details
   */
  handleClickOpen(event) {
    this.setState({
      open: true,
      currEvent: event
    });
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

    const events = this.props.events;

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
          {events.map((event, i) => event.createEventMarker(() => { this.handleClickOpen(event) }, i))} 
        </Map>
        <Dialog data-testid="map-dialog" open={this.state.open} onClose={this.handleClickClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{this.state.currEvent.title}</DialogTitle>
                <DialogContent>
                <Typography gutterBottom>
                  Details: {this.state.currEvent.description}
                </Typography>
                <Typography gutterBottom>
                  Hosted by: {this.state.currEvent.host}
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
