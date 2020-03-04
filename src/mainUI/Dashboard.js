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
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
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
    backgroundColor: '#6a2c70',
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

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      events: [],
      filters: {},
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
    this.setNewFilter = this.setNewFilter.bind(this);
  }

  /**
   * @function renderDashboard
   * Helper function to render the dashboard based on the events that are created using factory pattern
   * Will be passed to elements of dashboard depending on what is rendered
   * @return Rendered element for dashboard that is selected on click
   */
  renderDashboard() {
    console.log('Updated Dashboard: ', this.state.events);
    switch(this.state.dashboardPage){
      case "Map":
        return <GMap events={this.state.events} updateLocation={this.setUserLoc} updateFilter={this.setNewFilter}/>
      case "Profile":
        return <Profile />
      case "Events":
        return <EventList events={this.state.events} refreshEvents={this.refreshEvents}/>
      case "Rate":
        return <EventHistory events={this.state.events} user={this.props.user}/>
    }
  }

  handleEventsIn(newEvents) {
    this.setState({
      events: newEvents
    });
  }

  setPage(newPage) {
    if (newPage == "Events" || newPage == "Map") {
      this.refreshEvents();
    }

    this.setState({
      dashboardPage: newPage
    });
  }

  setUserLoc (newLocation) {
    console.log('Dashboard newUserLocation: ', newLocation);
    if (newLocation.lat != this.state.userLocation.lat || newLocation.lng != this.state.userLocation.lng) {
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
   * Event handler that fetches events from server
   * Returns and updates this.state.events with the events that are to be sent over
   */
  refreshEvents () {
    /**
     * Fetch all events depending on the filter that is available
     */
    var newfilter = this.state.filters;
    if (Object.keys(newfilter).length !== 0 && newfilter.eventTypes.length > 0) {
      console.log('filterEvents: ', newfilter)
      this.props.socket.emit('queryEvents', null, newfilter.eventTypes, null, null, null);
    } else {
      console.log('getting all events');
      this.props.socket.emit('getAllEvents');
    }

    /**
     * Handles events based on reply
     */
    this.props.socket.on('serverReply', (response) => {
      console.log('serverReply: ', response);
      var tempList = []; // Temporarily hold events if we need to filter through them
      var finalList = [] // Actual list of events
      response.map(event => {
        finalList.push(event);
      });

      /**
       * If the filter exists, we filter by distance; otherwise, we just return
       */
      if (Object.keys(newfilter).length !== 0 && this.state.userLocation != null && 
          this.state.userLocation.lat != null && 
          this.state.userLocation.lng != null) 
          {
            finalList.map(event => {
              
              var currposition = {latitude: this.state.userLocation.lat,
                longitude: this.state.userLocation.lng};

              var dist = getDistance(currposition, {latitude: event.location.lat, longitude: event.location.lng});

              if (newfilter != null) {
                if (dist <= newfilter.eventDistance * 1000) {
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
   * Default return function that renders dashboard onto browser
   * Uses open and dashboardPage variables to change the state of the dashboardUI
   */
    render() {
          const { classes } = this.props;
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
                  <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                    BruinMeet
                  </Typography>
                  <IconButton color="inherit">
                    <Badge badgeContent={4} color="secondary">
                      <NotificationsIcon />
                    </Badge>
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