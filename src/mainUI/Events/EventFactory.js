import React from 'react';
import {BMeetEvent} from './EventInterface';

export default class BMeetEventFactory {
    
    static createEvent(type, props) {
        switch (type) {
            case "bar":
                return new BMeetEvent(props);
            
            case "rave":
                return new BMeetEvent(props);


            case "house":
                return new BMeetEvent(props);

            case "concert":
                return new BMeetEvent(props);

            default:
                break;
        }
    }
}