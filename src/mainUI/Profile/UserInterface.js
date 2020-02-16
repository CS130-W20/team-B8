// BMeetUser: An object used to define and keep track of a user's profile information
// Uses notify to 
export class BMeetUser {
    constructor(props) {
        this.m_name = props.name;
        this.m_email = props.email;
        this.m_password = props.password;
        this.m_interests = props.interests;
        this.m_sessionToken = props.sessionToken;
        this.m_phone = props.phone;
        this.m_eventsAttending = props.events;
        this.m_eventsHosting = props.host;
        this.m_rating = props.rating;
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