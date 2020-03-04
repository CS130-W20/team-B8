import React from 'react';
import EventListRow from './EventListRow';
import { Marker } from 'google-maps-react';
import { getMarkerType, markerTypes } from './../markerPrefab/mapMarker';
import { DialogContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
const io = require("socket.io-client"),
socket = io.connect("http://localhost:8000");

// BMeetEvent: A base class type that is used to generate event objects
// Uses an observer pattern to notify and update attendees of event changes
export default class BMeetEvent{
    constructor(props) {
        this._id = props._id;
        this.title =  props.title;
        this.description = props.description;
        this.timeDate = props.timeDate;
        this.tags = props.tag;
        this.location = props.location;
        this.locationName = props.locationName;
        this.host =  props.host; // FULL USER OBJECT
        this.attendees = [];
        this.ratings = [];
        this.type = props.type;
    }
   /**
   * this method is used to generate an event list row used by EventList
   * @param none
   * @return EventListRow component corresponding to this Event
   */
    createEventListRow(refreshFunction) {
        return (
            <EventListRow
                key={this._id}
                _id={this._id}
                title={this.title}
                timeDate={this.timeDate}
                locationName={this.locationName}
                attendees={this.attendees}
                tag={this.tags}
                updateFunction={refreshFunction}
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
   * @param user: user object
   *
   */
    registerUser(user) {
        console.log("Adding ", user, " to event ", this.state.title);
        this.attendees.push(user);
        // add user to event object
        _id = (typeof this.state._id == "string") ? ObjectId(this.state._id) :
            this.state._id;
        socket.emit("addEventAttendee", _id, user);
        // add event to user object
        socket.emit("addUserAttendingEvent", user, this.state._id);
    }

    /**
   * this method is used to remove a user as an observer of this event
   * @param user: user OBJECT
   *
   */
    removeUser(user) {
        let userId = user["name"]
        var oldList = this.attendees;
        var removeIndex = oldList.map(function(item) { return item.state._id; }).indexOf(userId);
        //remove 1 element at removeIndex

        this.attendees.splice(removeIndex, 1);
        // remove user from event object
        socket.emit("removeUserAttendingEvent", userId, this.state._id);
        // remove event from user object
        socket.emit("removeEventAttendee", this.state._id, user);
    }

    /**
   * this method calls update() on all observers
   * @param msg: msg to be sent to everyone
   */
    notifyUsers(msg) {
        let recipients = []
        this.attendees.forEach(user => {
            console.log(user["name"]);
            recipients.push(user["phone"]);
            //element.update();
        })
        let req = {
          "sender": this.state.host["name"],
          "recipients": recipients,
          "message": msg
        }
        let event = {
          "host": this.state.host["name"],
          "title": this.state.title,
          "locationName": this.state.locationName
        }
        socket.emit("messageUsers", req, event);
    }
}
