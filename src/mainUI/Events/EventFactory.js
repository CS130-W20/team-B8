import React from 'react';
import {BMeetEvent} from './EventInterface';

export default class BMeetEventFactory {
    
    static createEvent(type, props) {
        switch (type) {
            case "bar":
                return <BMeetEvent {...props}/>;
                break;
            
            case "rave":
                return <BMeetEvent {...props}/>;
                break;

            case "house":
                return <BMeetEvent {...props}/>;
                break;

            case "concert":
                return <BMeetEvent {...props}/>;
                break;

            default:
                break;
        }
    }
}