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
        this.m_eventID = props._id;
        this.m_title =  props.title;
        this.m_timeDate = props.timeDate;
        this.m_tags = props.tags;
        this.m_location = props.location;
        this.m_locationName = props.locationName;
        this.m_host =  props.host;
        this.m_attendees = [];
        this.m_ratings = [];
        this.m_type = props.type;
    }

   /**
   * this method is used to generate an event list row used by EventList
   * @param none
   * @return EventListRow component corresponding to this Event
   */
    createEventListRow() {
        return (
            <EventListRow
                key={this.m_eventId} 
                _id={this.m_eventID}
                title={this.m_title}
                timeDate={this.m_timeDate}
                locationName={this.m_locationName}
                attendees={this.m_attendees}
                tag={this.m_tags}
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
            position={{ lat: this.m_location.lat, lng: this.m_location.lng}}
            name={this.m_title}
            key={key}
            icon={{url: getMarkerType(this.m_type), scaleSize: (.5, .5)}}/>
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
        this.m_attendees.push(user);
    }

    /**
   * this method is used to remove a user as an observer of this event
   * @param user object
   * 
   */
    removeUser(id) {
        var oldList = this.m_attendees;
        var removeIndex = oldList.map(function(item) { return item.state.m_ID; }).indexOf(id);
        this.m_attendees.splice(removeIndex, 1);
    }

    /**
   * this method calls update() on all observers
   * 
   */
    notifyUsers() {
        this.m_attendees.forEach(element => {
            console.log(element);
            element.update();
        })
    }
}