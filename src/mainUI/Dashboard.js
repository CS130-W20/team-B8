import React, {Component} from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MapIcon from '@material-ui/icons/Map';
import FaceIcon from '@material-ui/icons/Face';
import DateRangeIcon from '@material-ui/icons/DateRange';
import RateReviewIcon from '@material-ui/icons/RateReview';
import GMap from './Map/GMap';
import EventList from './Events/EventList';
import Profile from './Profile/Profile';
import EventHistory from './Rating/EventHistory';
import BMeetEventFactory from './Events/EventFactory';
import { getDistance } from 'geolib';
import { eventTypes } from './markerPrefab/mapMarker';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import BMLogo from './BruinMeetLogo.png';

/**
 * @var drawerWidth CSS Style for setting width of dashboard drawer
 */
const drawerWidth = 240;

/**
 * @var useStyle Function object that generates a style off of default MaterialsUI Theme
 * @see https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/dashboard
 * @see https://material-ui.com/styles/basics/
 */
const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    backgroundColor: '#311d3f',
    color: '#f5f5f5',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    color: 'white'
  },
  menuButtonHidden: {
    display: 'none',
    visibility: "hidden",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    backgroundColor: '#fc5185',
    borderWidth: 0,
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: '#b83b5e'
  },
  customDivider: {
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  customDrawerIcons: {
    color: 'white',
    visibility: "visible"
  },
  drawerOpenIcon: {
    visibility: 'hidden',
  },
  container: {
    height: "100%",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}
});

/**
 * Function component that uses Google Material UI Dashboard Template
 * Customized to include a state machine that switches views on button click
 * @see https://material-ui.com/getting-started/templates/dashboard/
 * @see https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/dashboard
 * 
 * @author Phipson Lee
 * @since 2020-02-15
 */
class Dashboard extends Component {

  /**
   * The follow constructor binds all the methods to the object and also declares socket event handlers
   * which are used to handle different types of server replies and responses
   * @param {Object} props the parameters passed on by the declaring component (i.e. App.js)
   * Contains the userID (i.e. user email) and socket object
   */
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      useFilter: false,
      open: false,
      events: [],
      hostEvents: [],
      attendedEvents: [],
      upcomingEvents: [],
      filters: {
        enableFilters: false,
        eventDistance: 1,
        eventTypes: [eventTypes.music]
      },
      dashboardPage: 'Map',
      userLocation: {}
    }

    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.setUserLoc = this.setUserLoc.bind(this);
    this.refreshEvents = this.refreshEvents.bind(this);
    this.handleEventsIn = this.handleEventsIn.bind(this);
    this.setPage = this.setPage.bind(this);
    this.renderDashboard = this.renderDashboard.bind(this);
    this.handleDashboardMap = this.handleDashboardMap.bind(this);
    this.handleEventList = this.handleEventList.bind(this);
    this.handleEventHistory = this.handleEventHistory.bind(this);
    this.setNewFilter = this.setNewFilter.bind(this);

    /**
     * Handle when we fetch events by ID
     */
    this.props.socket.on('queryEventsIDReply', (response) => {
      var eventPast = [];
      var eventFuture = []
      var date = new Date();

      response.forEach(event => {
        var tempDate = new Date(event.timeDate);
        if (tempDate.getTime() < date.getTime())
          eventPast.push(BMeetEventFactory.createEvent(event.type, event));
        else
          eventFuture.push(BMeetEventFactory.createEvent(event.type, event));
      });

      this.setState({
        attendedEvents: eventPast,
        upcomingEvents: eventFuture
      }, () => {
        eventPast = [];
        eventFuture = [];
        console.log('handleEventHistory (past): ', this.state.attendedEvents);
        console.log('handleEventHistory (future): ', this.state.upcomingEvents);
      });
    });

    /**
     * Handle when we fetch an updated copy of the user object for state reference
     * every time we receive the updated user object, we will handle the updated pages
     */
    this.props.socket.on('getUserReply', (user) => {
      console.log('Dashboard user: ', user);
      this.setState({
        user: user
      }, () => {
        switch(this.state.dashboardPage) {
          case "Map":
            this.handleDashboardMap();
            break;
          case "Events":
            this.handleEventList();
            break;
          case "Rate":
            this.handleEventHistory();
            break;
          default:
            break;
        }
      })
    });

    this.props.socket.on('getUserError', (error) => {
      this.props.loginError();
    })

    /**
     * Handle EventList Events based on ones that the user is hosting
     */
    this.props.socket.on('getEventsReply', (response) => {
      console.log('getEventsReply: ', response);
      let BMeetEvents = response.map(event => BMeetEventFactory.createEvent(event.type, event));
      this.setState({
        hostEvents: BMeetEvents
      });
    });

    /**
     * Handle Google Map Event Markers based on Reply
     */
    this.props.socket.on('queryEventsReply', (response) => {
      console.log('queryEventsReply: ', response);
      var tempList = []; // Temporarily hold events if we need to filter through them
      var finalList = [] // Actual list of events

      if (Object.keys(this.state.user).length > 0) {
        response.forEach(event => {
          console.log('User: ', this.state.user);

          if (!this.state.user.eventsAttending.includes(event._id) && 
              !this.state.user.eventsHosting.includes(event._id)) {
            finalList.push(event);
          }
        });
      }

      console.log('Filtered events finalList: ', finalList);

      /**
       * If the filter exists, we filter by distance; otherwise, we just return
       * Check to see that we actually have user's current location- otherwise, we ignore
       * and wait until it is updated before filtering events
       */
      if (this.state.filters.enableFilters &&
        Object.keys(this.state.filters).length !== 0 && this.state.userLocation != null && 
        this.state.userLocation.lat != null && 
        this.state.userLocation.lng != null) 
      {
          finalList.forEach(event => {
            
            var currposition = {latitude: this.state.userLocation.lat,
              longitude: this.state.userLocation.lng};

            var dist = getDistance(currposition, {latitude: event.location.lat, longitude: event.location.lng});

            if (this.state.filters != null) {
              if (dist <= this.state.filters.eventDistance * 1000) {
                console.log('You are ', dist, ' meters away from event');
                tempList.push(event);
              }
            }
          });

          let BMeetEvents = tempList.map(event => BMeetEventFactory.createEvent(event.type, event));
          console.log('BMeetEvents withfilter: ',BMeetEvents);
          this.handleEventsIn(BMeetEvents);
          finalList = [];
          tempList = [];
      } 
      else 
      {
          let BMeetEvents = finalList.map(event => BMeetEventFactory.createEvent(event.type, event));
          console.log('BMeetEvents nofilter: ', BMeetEvents);
          this.handleEventsIn(BMeetEvents);
          finalList = [];
          tempList = [];
      }
    });

  }

  /**
   * @function renderDashboard
   * Helper function to render the dashboard based on the events that are created using factory pattern
   * Will be passed to elements of dashboard depending on what is rendered
   * @return Rendered element for dashboard that is selected on click
   */
  renderDashboard() {
    console.log('Updated Dashboard: ', this.state.events);
    console.log('Updated User: ', this.state.user);
    // Note: this.state.user is the user object stored in the database
    switch(this.state.dashboardPage){
      case "Map":
        return <GMap events={this.state.events} 
                     updateLocation={this.setUserLoc} 
                     updateFilter={this.setNewFilter}
                     refreshMap={this.refreshEvents}
                     socket={this.props.socket}
                     userID={this.state.user}
                     successAlert={this.props.successAlert}
                     successFail={this.props.failAlert}/>
      case "Profile":
        return <Profile userID={this.state.user}/>
      case "Events":
        return <EventList events={this.state.hostEvents} 
                          userID={this.state.user} 
                          refreshEvents={this.refreshEvents}
                          socket={this.props.socket}
                          successAlert={this.props.successAlert}
                          successFail={this.props.failAlert}/>
      case "Rate":
        return <EventHistory eventsPast={this.state.attendedEvents} 
                             eventsFuture={this.state.upcomingEvents}
                             userID={this.state.user}
                             socket={this.props.socket}
                             refreshEvents={this.refreshEvents}
                             successAlert={this.props.successAlert}
                             failAlert={this.props.failAlert}/>
      default:
        return null;
    }
  }

  /**
   * 
   * @param {Object} newEvents 
   */
  handleEventsIn(newEvents) {
    this.setState({
      events: newEvents
    });
  }

  /**
   * 
   * @param {String} newPage The string tag for the new page that we will be showing
   */
  setPage(newPage) {
    this.setState({
      dashboardPage: newPage
    }, () => {this.refreshEvents()});
  }

  setUserLoc (newLocation) {
    console.log('Dashboard newUserLocation: ', newLocation);
    if (newLocation.lat !== this.state.userLocation.lat || newLocation.lng !== this.state.userLocation.lng) {
      this.setState({
        userLocation: newLocation
      }, () => {this.refreshEvents();
      });
    }
  }

  setNewFilter (newFilter) {
    //console.log('Dashboard setNewFilter: ', newFilter);
    this.setState({
      filters: newFilter
    }, () => {
      console.log('Dashboard setNewFilter: ', this.state.filters);
      this.refreshEvents();
    });
  }

  resetFilter () {
    this.setState({filters: []});
  }

  /**
   * @function handleDrawerOpen Function that sets the state of open. Passed to onClick events.
   */
    handleDrawerOpen = () => {
      this.setState({
        open: true,
      })
    };

  /**
   * @function handleDrawerOpen Function that sets the state of open. Passed to onClick events.
   */
    handleDrawerClose = () => {
      this.setState({
        open: false,
      })
    };

  /**
   * @function refreshEvents
   * Event handler that fetches events from server
   * Returns and updates this.state.events with the events that are to be sent over
   */
  refreshEvents () {
    this.props.socket.emit('getUser', this.props.userID);
  }

  /**
   * @function handleEventHistory Function that fetches the events to be displayed for rating
   * separates the list into events user will attend, and user has already attended, based on time
   */
  handleEventHistory() {
    console.log('user: ', this.state.user);

    // Get the events attended by this user
    this.props.socket.emit('queryEvents', null, null, null, null, null, this.state.user.eventsAttending);
  }

  /**
   * @function handleEventList helper function that is used to fetch events to be displayed for EventList
   */
  handleEventList() {
    let date = new Date();
    console.log('At handleEventList; current Date: ', date.toISOString());

    /**
     * Fetch all events that the current user is hosting
     */
    this.props.socket.emit('getEvents', this.props.userID, date.toISOString());
  }

  /**
   * @function handleDashboardMap helper function that is used to fetch events to be displayed for the map
   */
  handleDashboardMap() {
    /**
     * Fetch all events depending on the filter that is available
     */
    var newfilter = this.state.filters;
    let date = new Date();
    console.log('At handleDashboardMap; current Date: ', date.toISOString());
    if (this.state.filters.enableFilters && Object.keys(newfilter).length !== 0 && newfilter.eventTypes.length > 0) {
      console.log('filterEvents: ', newfilter)
      this.props.socket.emit('queryEvents', null, newfilter.eventTypes, null, date.toISOString(), null, null);
    } else {
      console.log('no filter');
      this.props.socket.emit('queryEvents', null, null, null, date.toISOString(), null, null);
    }
  }



  /**
   * Default return function that renders dashboard onto browser
   * Uses open and dashboardPage variables to change the state of the dashboardUI
   */
    render() {
          const { classes, userID } = this.props;
          console.log('Logged in user: ', userID);
          return (
            <div className={classes.root}>
              <CssBaseline />
              <AppBar position="absolute" className={clsx(classes.appBar, this.state.open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                  <IconButton
                    data-testid="hamburger-button"
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={this.handleDrawerOpen}
                    className={clsx(classes.menuButton, this.state.open && classes.menuButtonHidden)}>
                  <MenuIcon />
                  </IconButton>
                  <img style={{width: 50, height: 50}}src={BMLogo}/>
                  <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                    BruinMeet
                  </Typography>
                  <IconButton color="inherit">
                    <ExitToAppIcon color="inherit" onClick={this.props.logoutFunction}/>
                  </IconButton>
                </Toolbar>
              </AppBar>
              <Drawer
                variant="permanent"
                classes={{
                  paper: clsx(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
                }}
                open={this.state.open}>
                <div className={classes.toolbarIcon}>
                  <IconButton data-testid="left-button" onClick={this.handleDrawerClose}>
                    <ChevronLeftIcon className={clsx(classes.customDrawerIcons)}/>
                  </IconButton>
                </div>
                <Divider className={clsx(classes.customDivider)}/>
                <List>
                  <ListItem data-testid="profile-button" button onClick={() => this.setPage("Profile")}>
                        <ListItemIcon>
                        <FaceIcon />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItem>
                    <ListItem data-testid="map-button" button onClick={() => this.setPage("Map")}>
                        <ListItemIcon>
                        <MapIcon />
                        </ListItemIcon>
                        <ListItemText primary="Event Map" />
                    </ListItem>
                    <ListItem data-testid="events-button" button onClick={() => this.setPage("Events")}>
                        <ListItemIcon>
                        <DateRangeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Your Events" />
                    </ListItem>
                    <ListItem data-testid="rating-button" button onClick={() => this.setPage("Rate")}>
                        <ListItemIcon>
                        <RateReviewIcon />
                        </ListItemIcon>
                        <ListItemText primary="Write Reviews" />
                    </ListItem>
                </List>
              </Drawer>
              <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                  {this.renderDashboard()}
                </Container>
              </main>
            </div>
          );
        }
}
export default withStyles(styles, {withTheme: true})(Dashboard);