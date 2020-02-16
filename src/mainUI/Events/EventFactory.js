import {BMeetEvent} from './EventInterface';

export class BMeetEventFactory {
    
    createEvent(type, props) {
        switch (type) {
            case "beer":
                return BMeetEvent(props);
                break;
            
            case "music":
                return BMeetEvent(props);
                break;

            case "club":
                return BMeetEvent(props);
                break;

            case "rave":
                return BMeetEvent(props);
                break;

            default:
                break;
        }
    }
}