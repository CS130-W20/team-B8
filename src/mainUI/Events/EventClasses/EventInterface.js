import React from 'react';
import EventListRow from '../EventListRow';
import EventHistoryRow from '../EventHistoryRow';
import { Marker } from 'google-maps-react';
import { getMarkerType, markerTypes } from '../../markerPrefab/mapMarker';
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
        this.questions = [{id: 'name', label: "What was your experience like?"}]
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
                updateFunction={updateFunction}/>
        )
    }

   /**
   * this method is used to generate an event history row used by EventHistory
   * @param none
   * @return EventHistoryRow component corresponding to this Event
   */
    createEventHistoryRow(){
        console.log("creating event history row");
        return (
            <EventHistoryRow
                key={this._id} 
                _id={this._id}
                title={this.title}
                timeDate={this.timeDate}
                locationName={this.locationName}
                attendees={this.attendees}
                tag={this.tags}     
                questions={this.questions}
            />
        )
    }
    /**
   * this method is used to generate an event list row used by EventHistory
   * @param handleClickOpen callback to open modal relating to this marker
   * @param key unique index of this marker
   * @return Marker component corresponding to this Event
   */
    createEventMarker(handleClickOpen, key){
        console.log(this.type);
        console.log(this.location);
        console.log('URL for Marker: ', getMarkerType(this.type));
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
    registerUser(user, socket) {
        console.log("Adding ", user, " to event ", this._id);
        socket.emit("addEventAttendee", this._id, user);
        // add event to user object
        socket.emit("addUserAttendingEvent", user.name, this._id);
    }

    /**
     * this method is used to register a user an observer of this event
     * @param user: user object
     *
     */
    registerUser(user, socket) {
        console.log("Adding ", user, " to event ", this.title);

        socket.emit("addEventAttendee", this._id, user);
        // add event to user object
        socket.emit("addUserAttendingEvent", user, this._id);
    }

    /**
    * this method is used to remove a user as an observer of this event
    * @param user: user OBJECT
    *
    */
    removeUser(user, socket) {
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
    notifyUsers(msg, socket) {
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