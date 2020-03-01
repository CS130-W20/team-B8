// BMeetUser: An object used to define and keep track of a user's profile information
// Uses notify to 
export class BMeetUser {
    constructor(props) {
        this.name = props.name;
        this.email = props.email;
        this.password = props.password;
        this.interests = props.interests;
        this.sessionToken = props.sessionToken;
        this.phone = props.phone;
        this.eventsAttending = props.events;
        this.eventsHosting = props.host;
        this.rating = props.rating;
    }

    // TODO: Use Twilio to send SMS/Updates about an event
    // Can also integrate with proxy method/design pattern to perform extra actions
    update() {
        
    }

    attendEvent(event) {

    }

    hostEvent(event) {

    }

    getRating() {

    }

}