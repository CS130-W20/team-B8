import BarhoppingEvent from './EventClasses/BarhoppingEvent.js'
import RaveEvent from './EventClasses/RaveEvent.js'
import HousePartyEvent from './EventClasses/HousePartyEvent.js'
import ConcertEvent from './EventClasses/ConcertEvent.js'
import { eventTypes } from '../markerPrefab/mapMarker.js'

export default class BMeetEventFactory {
    
    static createEvent(type, props) {
        switch (type) {
            case eventTypes.barHopping:
                return new BarhoppingEvent(props);
            
            case eventTypes.rave:
                return new RaveEvent(props);

            case eventTypes.houseParty:
                return new HousePartyEvent(props);

            case eventTypes.music:
                return new ConcertEvent(props);

            default:
                break;
        }
    }
}