import React from 'react';
import { Marker } from 'google-maps-react';
import { markerTypes } from './../markerPrefab/mapMarker';
import { GoogleApiWrapper } from 'google-maps-react';
import Dimensions from 'react-dimensions';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


function MarkerDetail(markerProps, index) {
    const [dialogopen, setDOpen] = React.useState(false);

    const handleClickOpen = () => {
        setDOpen(true);
    };

    const handleClickClose = () => {
        setDOpen(false);
    };

    console.log(markerProps);

    return(
            <Marker
                onClick={handleClickOpen}
                position={{ lat: markerProps.lat, lng: markerProps.lng}}
                name={markerProps.name}
                key={index}
                icon={{url: markerProps.type, scaleSize: (.5, .5)}}/>
    );
}

export default Dimensions({elementResize: true, className: 'react-dimensions-wrapper'})(GoogleApiWrapper({
    apiKey: "AIzaSyD2EzcDG507GgPgPHVEoVpgFngvsMGIElg"
  })(MarkerDetail));