import React from 'react';
import EventListRow from './EventListRow';
import { Marker } from 'google-maps-react';
import { getMarkerType, markerTypes } from './../markerPrefab/mapMarker';
import { DialogContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

// BMeetEvent: A base class type that is used to generate event objects
// Uses an observer pattern to notify and update attendees of event changes
export default class BMeetEvent{
    constructor(props) {
        this._id = props._id;
        this.title =  props.title;
        this.description = props.description;
        this.timeDate = props.timeDate;
        this.tags = props.tags;
        this.location = props.location;
        this.locationName = props.locationName;
        this.host =  props.host;
        this.attendees = [];
        this.ratings = [];
        this.type = props.type;

        console.log(props);
    }

   /**
   * this method is used to generate an event list row used by EventList
   * @param none
   * @return EventListRow component corresponding to this Event
   */
    createEventListRow(updateFunction) {
        return (
            <EventListRow
                key={this._id} 
                _id={this._id}
                title={this.title}
                timeDate={this.timeDate}
                locationName={this.locationName}
                attendees={this.attendees}
                tag={this.tags}
                type={this.type}
                updateFunction={updateFunction}
            />
        )
    }

    /**
   * this method is used to generate an event list row used by EventHistory
   * @param none
   * @return EventHistoryRow component corresponding to this Event
   */
    createEventHistoryRow(){
        /* TO DO: return row component based on event data*/
    }

    /**
   * this method is used to generate an event list row used by EventHistory
   * @param handleClickOpen callback to open modal relating to this marker
   * @param key unique index of this marker
   * @return Marker component corresponding to this Event
   */
    createEventMarker(handleClickOpen, key){
        return(
          <Marker
            onClick={handleClickOpen}
            position={{ lat: this.location.lat, lng: this.location.lng}}
            name={this.title}
            key={key}
            icon={{url: getMarkerType(this.type), scaleSize: (.5, .5)}}/>
        )
    }

    /**
   * this method is used to generate an event list row used by EventHistory
   * @param none
   * @return EventHistoryRow component corresponding to this Event
   */
    createMapModal(){
        return (
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
        );
    }

    /**
   * this method is used to register a user an observer of this event
   * @param user object
   * 
   */
    registerUser(user) {
        this.attendees.push(user);
    }

    /**
   * this method is used to remove a user as an observer of this event
   * @param user object
   * 
   */
    removeUser(id) {
        var oldList = this.attendees;
        var removeIndex = oldList.map(function(item) { return item.state._id; }).indexOf(id);
        this.attendees.splice(removeIndex, 1);
    }

    /**
   * this method calls update() on all observers
   * 
   */
    notifyUsers() {
        this.attendees.forEach(element => {
            console.log(element);
            element.update();
        })
    }
}