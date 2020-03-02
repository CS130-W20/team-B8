import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { getMarkerType, markerTypes } from './../markerPrefab/mapMarker';
import Dimensions from 'react-dimensions';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Geocode from "react-geocode";
import { getDistance } from 'geolib';
import EventPage from '../Events/EventPage';


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
    
    this.handleClickClose = this.handleClickClose.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    //this.resetMap = this.resetMap.bind(this);
    //this.filterMarkers = this.filterMarkers.bind(this);

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        this.setState({
          userLocation: { lat: latitude, lng: longitude },
          loading: false,
        });

        this.props.updateLocation(this.state.userLocation);
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
  //this.resetMap();
}

/*
componentDidUpdate(prevProps) {
  //console.log(prevProps);
  //console.log(this.props);
  var newObj = {
    eventTypes: prevProps.mapFilters.eventTypes,
    eventDistance: prevProps.mapFilters.eventDistance
  }
  if (this.props.mapFilters != null) {
    if (this.props.mapFilters.eventDistance == prevProps.mapFilters.eventDistance) {
      if (this.props.mapFilters.eventTypes.length != prevProps.mapFilters.eventTypes.length) {
        console.log('Changed tags');
        var newObj = {
          eventTypes: this.props.mapFilters.eventTypes,
          eventDistance: this.props.mapFilters.eventDistance
        }
        this.setState({
          filters: newObj
        });
        console.log(this.state.filters);

        this.resetMap();
      }

      for (var i = 0; i < this.props.mapFilters.eventTypes.length; i++) {
        if (this.props.mapFilters.eventTypes[i] != prevProps.mapFilters.eventTypes[i]) {
          console.log('Changed tags');
          this.setState({
            filters: newObj
          });
          console.log(this.state.filters);

          this.resetMap();
        }
      }
    } else {
      console.log('Changed distance');
      this.setState({
        filters: newObj
      });
      console.log(this.state.filters);
      this.resetMap();
    }
  }
}

resetMap() {
  console.log(this.state.filters);
  var markerList = []

  if (this.state.filters == null)
    return;

  var eventDist = this.state.filters.eventDistance;

  if (this.state.filters.eventTypes.length > 0) {
    socket.emit('queryEvents', null, this.state.filters, null, null, null);
  } else {
    socket.emit('getAllEvents'); // TODO: Query by tags
  }

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

    var filteredEvents = this.filterMarkers(markerList, eventDist);

    console.log(filteredEvents);

    this.setState({
      markers: filteredEvents
    });

    markerList = [];
  });
  }*/

  /**
   * Filters out the markers to be displayed on the maps, based on user query and filtering
   */

  /*
  filterMarkers(eventList, eventDist) {
    var finalList = [];
    if (this.state.userLocation != null) {
      eventList.map(event => {
          var currposition = {latitude: this.state.userLocation.lat,
                              longitude: this.state.userLocation.lng};
          var dist = getDistance(currposition, 
            {
              latitude: event.lat,
              longitude: event.lng
            });
          
          if (dist <= eventDist * 1000) {
            console.log('You are ', dist, ' meters away from event');
            finalList.push(event);
          }
      });
    }

    console.log(finalList);
    return finalList;
  }*/

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
          <EventPage currEvent={this.state.currEvent}></EventPage>
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
