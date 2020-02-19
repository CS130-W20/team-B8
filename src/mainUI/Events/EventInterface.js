// BMeetEvent: A base class type that is used to generate event objects
// Uses an observer pattern to notify and update attendees of event changes
export class BMeetEvent {
    constructor(props) {
        this.m_eventID = props.eventID;
        this.m_title =  props.title;
        this.m_timeDate = props.timeDate;
        this.m_tags = props.tags;
        this.m_location = props.location;
        this.m_host =  props.host;
        this.m_attendees = [];
        this.m_ratings = [];
    }

    registerUser(user) {
        this.m_attendees.push(user);
    }

    removeUser(id) {
        oldList = this.state.m_attendees;
        var removeIndex = oldList.map(function(item) { return item.state.m_ID; }).indexOf(id);
        m_attendees.splice(removeIndex, 1);
    }

    notifyUsers() {
        this.state.m_attendees.forEach(element => {
            console.log(element);
            element.update();
        })
    }
}