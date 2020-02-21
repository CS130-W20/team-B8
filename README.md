# BruinMeet
BruinMeet is a web application designed for users to create a time-based and location-based public event navigator visible to all other users on the app, offer in-app services to organize and share the event, and allow attendees to rate and review the events and the hosts, which are made public to all app users.

## Directory Structure
The structure of our directory is as follows:

```
.
|--src
|   |
|   |-- __tests__ // Main test folder for all our ReactJS Component Test Scripts
|   |-- mainUI // Main folder that contains all the components/controller scripts we have used to develop our Front-end
|          |
|          |-- Events // All objects/components for creating/editing/deleting/messaging events
|          |-- Profile // Objects/components for displaying user profile
|          |-- Map // Google Map UI for locating and finding events
|          |-- Rating // Objects/components for rating and finding ratings of users
|          |-- markerPrefab // Subfolder for developing markers to display on Google Maps
|          |-- Dashboard.js // Main UI component for creating the dashboard interface
|
|--server // All database code and test code for our database/server-side implementation
```

## Installation/Run instructions
npm install
  Install all required npm modules

Install and start mongodb server using instructions below 
  https://docs.mongodb.com/manual/installation/

Run 'mongo < dbsetup' to create required dbs and collections

npm start (within app)
  Starts the development server.
  Ctrl-C in cmd to exit.

npm run build
  Bundles the app into static files for production.

npm test
  Starts the test runner. Mainly used to test and 

npm run eject
  Removes this tool and copies build dependencies, configuration files
  and scripts into the app directory. If you do this, you can’t go back!

## Documentation
Documentation of individual objects and components can be found in the nested README.md files of each folder. For example, information about the Event objects/implementations can be found via the `./src/mainUI/Events/README.md`.

Javadoc-like comments have been added to each ReactJS component and implemented module. A brief overview of our APIs and documentation can also be found in our Part C Report.

## Testing
As mentioned, testing can be found in both the `./server/` folder, for tests for the database, as well as the `./src/__tests__/` folder, which are unit tests for individual ReactJS components. The README.md file and javadoc comments describe the intended test oracle as well as the intended behavior of our implemented tests.

