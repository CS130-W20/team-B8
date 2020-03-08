import React from 'react';
import EventListRow from '../EventListRow';
import EventHistoryRow from '../EventHistoryRow';
import { Marker } from 'google-maps-react';
import { getMarkerType, markerTypes } from '../../markerPrefab/mapMarker';
import { DialogContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const io = require("socket.io-client"),
socket = io.connect("http://localhost:8000");


const TEST_NUMBER = "+15005550006"; // Won't actually send message, but will give you success response
const TRIAL_NUMBER = "17205753789"; // Actual trial number you can use to test message sending

// BMeetEvent: A base class type that is used to generate event objects
// Uses an observer pattern to notify and update attendees of event changes
export default class BMeetEvent{
    constructor(props) {
        this._id = props._id;
        this.title =  props.title;
        this.description = props.description;
        this.timeDate = props.timeDate;
        this.tag = props.tag;
        this.location = props.location;
        this.locationName = props.locationName;
        this.host =  props.host;
        this.attendees = props.attendees;
        this.reviews = props.reviews;
        this.type = props.type;
        this.questions = [{id: 'name', label: "What was your experience like?"}]

        console.log('BMeetEvent: ',props);
        console.log('this.attendees: ', this.attendees, this.attendees.length);

        this.notifyUsers = this.notifyUsers.bind(this);
        this.createEventListRow = this.createEventListRow.bind(this);
        this.createEventMarker = this.createEventMarker.bind(this);
        this.registerUser = this.registerUser.bind(this);
        this.removeUser = this.removeUser.bind(this);
    }

   /**
   * this method is used to generate an event list row used by EventList
   * @param none
   * @return EventListRow component corresponding to this Event
   */
    createEventListRow(updateFunction, socket, successAlert, failAlert) {
        return (
            <EventListRow
                key={this._id} 
                _id={this._id}
                title={this.title}
                timeDate={this.timeDate}
                locationName={this.locationName}
                attendees={this.attendees}
                tag={this.tag}
                type={this.type}
                updateFunction={updateFunction}
                notifyFunction={this.notifyUsers}
                socket={socket}
                successAlert={successAlert}
                failAlert={failAlert}/>
        )
    }

   /**
   * this method is used to generate an event history row used by EventHistory
   * @param none
   * @return EventHistoryRow component corresponding to this Event
   */
    createEventHistoryRow(user, socket, hasPassed, refreshEvents, successAlert, failAlert){
        console.log(this.reviews);
        let userReview = this.reviews.reduce((userReview, reviewObj) => {
            return (reviewObj.user._id === user._id) ? reviewObj : userReview
        }, null);
        console.log("user review: ", userReview);

        console.log("creating event history row");
        return (
            <EventHistoryRow
                key={this._id} 
                _id={this._id}
                title={this.title}
                timeDate={this.timeDate}
                locationName={this.locationName}
                attendees={this.attendees}
                tag={this.tag}     
                host={this.host}
                questions={this.questions}
                userReview={userReview}
                user={user}
                refreshEvents={refreshEvents}
                submitReview={this.submitReview}
                review={hasPassed}
                successAlert={successAlert}
                failALert={failAlert}
                leaveEvent={() => {
                    this.removeUser(user, socket);
                    refreshEvents();
                }}/>)
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
        // add user to event object
        socket.emit("addEventAttendee", this._id, user);
        // add event to user object
        socket.emit("addUserAttendingEvent", user.email, this._id);

        let req = {
            "sender": TRIAL_NUMBER,//this.host.phone, // You can use TRIAL_NUMBER to send an actual message not using your phone number
            "recipients": [user.phone],
            "message": "This is your receipt for attending this event. Please show this when you arrive! Hope to see you there!"
            }
        let event = {
        "host": this.host,
        "title": this.title,
        "locationName": this.locationName,
        "hostNumber": this.host.phone
        }

        socket.emit("messageUsers", req, event);
    }

    /**
    * this method is used to remove a user as an observer of this event
    * @param user: user OBJECT
    *
    */
    removeUser(user, socket) {
        console.log("Removing user: ", user, "from event: ", this._id);
        // remove user from event object
        socket.emit("removeUserAttendingEvent", user.email, this._id);
        // remove event from user object
        socket.emit("removeEventAttendee", this._id, user._id);
    }

    submitReview(user, rating, review, refreshEvents){
        socket.emit('addEventReview', this._id, user, rating, review);
        refreshEvents();
    }

    /**
    * this method calls update() on all observers
    * @param msg: msg to be sent to everyone
    */
    notifyUsers(msg, socket) {
        let recipients = []
        console.log('attendees for Message: ', this.attendees);
        this.attendees.forEach(user => {
            console.log('messaging: ', user);
            recipients.push(user["phone"]);
        })

        console.log('recipientPhones: ', recipients);

        let req = {
        "sender": TRIAL_NUMBER,//this.host.phone, // You can use TRIAL_NUMBER to send an actual message not using your phone number
        "recipients": recipients,
        "message": msg
        }
        let event = {
        "host": this.host,
        "title": this.title,
        "locationName": this.locationName,
        "hostNumber": this.host.phone
        }
        socket.emit("messageUsers", req, event);
    }
}