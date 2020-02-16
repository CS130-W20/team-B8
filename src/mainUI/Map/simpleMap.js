import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { markerTypes } from './../markerPrefab/mapMarker';
import Dimensions from 'react-dimensions';
import MarkerDetail from './markerDetail';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';



class SimpleMap extends Component {

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
    //this.render

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

  // Add a new marker for the map
  addMarker(value) {
    this.setState({
      markers: this.markers.push(value)
    });
  }

  // TODO: Change rendered markers based on filters
  filterMarkers() {
    
  }

  handleClickOpen() {
    this.setState({
      open: true,
    })
  };

  handleClickClose() {
    this.setState({
      open: false,
    })
  };

  renderMarker(marker) {
    return(
      <Marker 
        position={{ lat: marker.lat, lng: marker.lng}}
        name={marker.name}
        id={marker.id}
        type={marker.type}/>
    )
  }

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
