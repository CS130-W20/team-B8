import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { markerTypes } from './../markerPrefab/mapMarker';
import Dimensions from 'react-dimensions';


class SimpleMap extends Component {

  constructor(props){
    super(props);
    this.current = React.createRef();
    this.state = {
        markers: [],
    }
    this.addMarker = this.addMarker.bind(this);
    this.filterMarkers = this.filterMarkers.bind(this);
  }

  componentDidMount() {
    this.setState({
      markers: [
        {"name" : "Test 1", "lat": 32.00, "lng": 122.00, "type": markerTypes.gaming},
        {"name" : "Test 2", "lat": 23.00, "lng": -126.00, "type": markerTypes.food},
        {"name" : "Test 3", "lat": 35.00, "lng": 104.00, "type": markerTypes.dj},
        {"name" : "Test 4", "lat": 45.00, "lng": 203.00, "type": markerTypes.dance},
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
    return (
      <Map
        google={this.props.google}
        zoom={8}
        style={{
          width: this.props.containerWidth,
          height: this.props.containerHeight
        }}
        initialCenter={{ lat: 47.444, lng: -122.176}}>
        {this.state.markers.map((marker, i) =>{
              console.log(marker);
              return(
                <Marker 
                  position={{ lat: marker.lat, lng: marker.lng}}
                  name={marker.name}
                  key={i}
                  icon={{url: marker.type, scaleSize: (.5, .5)}}/>
              )
        })}
      </Map>
    );
  }
}

// Add API Key as String
// AIzaSyD2EzcDG507GgPgPHVEoVpgFngvsMGIElg
export default Dimensions({elementResize: true, className: 'react-dimensions-wrapper'})(GoogleApiWrapper({
  apiKey: "AIzaSyD2EzcDG507GgPgPHVEoVpgFngvsMGIElg"
})(SimpleMap));
