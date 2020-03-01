import React from 'react';
import { Marker } from 'google-maps-react';
import { render } from '@testing-library/react';
import { getMarkerType, markerTypes } from '../../markerPrefab/mapMarker';

export default class ConcertMarker extends React.Component{

    render = () => {
        return(
            <Marker
            onClick={this.props.handleClickOpen}
            position={{ lat: this.props.location.lat, lng: this.props.location.lng}}
            name={this.props.title}
            icon={{url: getMarkerType(this.props.type), scaleSize: (.5, .5)}}/>
        )        
    }
}
// {
            
          //       return(
          //         <Marker
          //           onClick={this.handleClickOpen}
          //           position={{ lat: marker.lat, lng: marker.lng}}
          //           name={marker.name}
          //           key={i}
          //           icon={{url: marker.type, scaleSize: (.5, .5)}}/>
          //       )
          // })}

