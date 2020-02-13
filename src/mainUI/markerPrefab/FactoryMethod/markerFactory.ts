import {BMeetFactory} from './factoryInterface';
import { Marker } from 'google-maps-react';
import CustomMarker, { markerTypes } from '../mapMarker';


export default class markerFactory implements BMeetFactory {
    createMarker(name: string) {

        switch (name) {
            case "beer":
                break;

            case "vodka":
                break;

            case "dj":
                break;

            case "rave":
                break;

            case "wine":
                break;

            default:
                break;
        }
    }
}