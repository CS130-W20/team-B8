Tests folder contains several test scripts for different features and functionality. The tests in particular are divided up according to stories/tasks and ReactJS components. The subdirectories are as follows:

dashboardTest.js - Unit Testing; Test cases for dashboard component in app. Used to test the visibility and state changes in menu, navigation, as well as verifying that certain components, such as different pages, are hidden until onClick events. Done in isolation to database and server.
1. Make sure that map is displayed on start and the icon bar is closed
2. Make sure that the icon button can be pressed to toggle opening and closing the menu
3. Navigation between different screens/pages
4. Verifying dialog boxes are closed when there are no click events

eventTest.js - Unit Testing; Test cases for for event component in app. Used to test onclick events and user input for creating an event, editing an event, deleting an event. Done in isolation to database and server. Still currently a work in progress, as some features such as editing, messaging, and deleting events require an event to exist prior.
1. Make sure events are visible at initialization
2. Make sure that users can edit and manipulate form when creating an event
3. Make sure that users can edit and manipulate a filled form containing event information when editing an event
4. Make sure that users can input customized message when messaging about events
5. Make sure that users can delete events.

