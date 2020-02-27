import React, {Component} from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import TextField from '@material-ui/core/TextField';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';


/**
 * Helper class/module that references example code obtained from external npm library
 * @see react-places-autocomplete https://www.npmjs.com/package/react-places-autocomplete
 * 
 * Used to fetch location based on search query to give users a list of potential auto-complete locations
 * Integrated with Material-UI
 */ 
class LocationSearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = { address: this.props.default };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
 
  handleChange = newAddress => {
    this.setState({ address: newAddress });
    //this.props.updateFunction(newAddress);
  };
 
  handleSelect = newAddress => {
    this.setState({ address: newAddress });
    geocodeByAddress(newAddress)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error));
    this.props.updateFunction(newAddress);
  };
 
  render() {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div style={{paddingTop: "2.5%", paddingBottom: "2.5%"}}>
              <TextField
                autoFocus
                margin="dense"
                inputProps={{
                  "data-testid":"event-location"
                }}
                id="event-location"
                value={this.state.address}
                type="email"
                fullWidth
                {...getInputProps({
                    placeholder: 'Location',
                    className: 'location-search-input',
                })}/>
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                    onClick={() => {this.handleSelect(suggestion.description)}}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

export default (GoogleApiWrapper({
  apiKey: "AIzaSyD2EzcDG507GgPgPHVEoVpgFngvsMGIElg"
})(LocationSearchInput));