import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import Dimensions from 'react-dimensions';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import EventPage from '../Events/EventPage';
import { markerTypes } from './../markerPrefab/mapMarker';

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
          open: false,
          currEvent: {},
      }
    
      this.handleClickClose = this.handleClickClose.bind(this);
      this.handleClickOpen = this.handleClickOpen.bind(this);
      this.getMarkerType = this.getMarkerType.bind(this);
      this.handleAttendEvent = this.handleAttendEvent.bind(this);

      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;

          this.setState({
            userLocation: { lat: latitude, lng: longitude },
            loading: false,
          }, () => {this.props.updateLocation(this.state.userLocation)}
          );
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
  getMarkerType = (eventType) => {
    switch(eventType){
      case "bar":
        return markerTypes.food;
      case "house":
        return markerTypes.gaming;
      case "rave":
        return markerTypes.dj;
      case "concert":
        return markerTypes.dance;
      default:
        return markerTypes.hats;
    }
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
   * @function handleAttendEvent Calls the observer method in Event Interface to allow users to register user
   * to an event and receive SMS notifications about the event
   * Also closes the dialog box so users can keep searching through event
   */
  handleAttendEvent() {
    //console.log('simpleMap registering user: ', this.props.userID);
    //this.props.socket.emit("addEventAttendee", this.state.currEvent._id, this.props.userID);
    //this.props.socket.emit("addUserAttendingEvent", this.props.userID.name, this.state.currEvent._id);
    this.state.currEvent.registerUser(this.props.userID, this.props.socket);
    this.handleClickClose();
    this.props.refreshMap();
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

    const {events} = this.props;
    console.log('simpleMap events: ', events);

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
          {events.map((marker, i) =>{
                console.log(marker);
                //this.renderMarker(marker, i);
                return(
                  <Marker
                    onClick={() => this.handleClickOpen(marker)}
                    position={{ lat: marker.location.lat, lng: marker.location.lng}}
                    name={marker.title}
                    key={i}
                    icon={{url: this.getMarkerType(marker.type), scaleSize: (.5, .5)}}/>
                )
          })}
        </Map>
        <Dialog data-testid="map-dialog" open={this.state.open} onClose={this.handleClickClose} aria-labelledby="form-dialog-title">
          <EventPage currEvent={this.state.currEvent}></EventPage>
          <DialogActions>
              <Button onClick={this.handleClickClose} color="primary">
                  Cancel
              </Button>
              <Button onClick={this.handleAttendEvent} color="primary">
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
