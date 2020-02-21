import React from 'react';
import { Marker } from 'google-maps-react';
import './Marker.css';

// TODO: Import images more efficiently
import djImg from './BruinMeet/dj.png';
import danceImg from './BruinMeet/dance.png'
import foodImg from './BruinMeet/food.png'
import gameImg from './BruinMeet/gaming.png'
import hatImg from './BruinMeet/hats.png'

// TODO: Modify depending on marker types
export const markerTypes = {
    dj: djImg,
    dance: danceImg,
    food: foodImg,
    gaming: gameImg,
    hats: hatImg,
};

export const getMarkerType = (eventType) => {
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

class CustomMarker extends Marker {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      id: props.id,
      type: props.type,
    }
  }

  render() {
    return (
      <div className="marker"
      style={{ cursor: 'pointer'}}
      title={this.state.name}>
        <img src={this.state.type} className="markerIcon"/>
      </div>
    );
  };
}

export default CustomMarker;