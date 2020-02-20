import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
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


/**
 * @var AppComponents Dictionary that maps specific state of dashboard to a component
 * Toggles what is visible on DOM when a button is pressed
 * Used in Dashboard component
 */
const AppComponents = {
  "Map": <GMap />,
  "Profile": <Profile />,
  "Events": <EventList />,
  "Rate": <EventHistory />
}

/**
 * @var drawerWidth CSS Style for setting width of dashboard drawer
 */
const drawerWidth = 240;

/**
 * @var useStyle Function object that generates a style off of default MaterialsUI Theme
 * @see https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/dashboard
 * @see https://material-ui.com/styles/basics/
 */
const useStyles = makeStyles(theme => ({
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
}));

/**
 * Function component that uses Google Material UI Dashboard Template
 * Customized to include a state machine that switches views on button click
 * @see https://material-ui.com/getting-started/templates/dashboard/
 * @see https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/dashboard
 * 
 * @author Phipson Lee
 * @since 2020-02-15
 */
export default function Dashboard() {
  /**
   * @var classes Calls Material-UI useStyles to generate/inherit material UI styles generated from a default theme
   */
    const classes = useStyles();

  /**
   * @var open Hook set to false to indicate state of dashboard
   * @var setOpen Function that changes the state variable open
   */
    const [open, setOpen] = React.useState(false);

  /**
   * @var dashboardPage Hook to display specific component based on button click
   * @var setPage Function that changes the state variable dashboardPage
   */
    const [dashboardPage, setPage] = React.useState('Map');

  /**
   * @var handleDrawerOpen Function that sets the state of open. Passed to onClick events.
   */
    const handleDrawerOpen = () => {
      setOpen(true);
    };

  /**
   * @var handleDrawerOpen Function that sets the state of open. Passed to onClick events.
   */
    const handleDrawerClose = () => {
      setOpen(false);
    };

  /**
   * Default return function that renders dashboard onto browser
   * Uses open and dashboardPage variables to change the state of the dashboardUI
   */
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              data-testid="hamburger-button"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, open && classes.menuButtonHidden)}>
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
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}>
          <div className={classes.toolbarIcon}>
            <IconButton data-testid="left-button" onClick={handleDrawerClose}>
              <ChevronLeftIcon className={clsx(classes.customDrawerIcons)}/>
            </IconButton>
          </div>
          <Divider className={clsx(classes.customDivider)}/>
          <List>
            <ListItem button onClick={() => setPage("Profile")}>
                  <ListItemIcon>
                  <FaceIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
              </ListItem>
              <ListItem button onClick={() => setPage("Map")}>
                  <ListItemIcon>
                  <MapIcon />
                  </ListItemIcon>
                  <ListItemText primary="Event Map" />
              </ListItem>
              <ListItem button onClick={() => setPage("Events")}>
                  <ListItemIcon>
                  <DateRangeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Your Events" />
              </ListItem>
              <ListItem button onClick={() => setPage("Rate")}>
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
            {AppComponents[dashboardPage]}
          </Container>
        </main>
      </div>
    );
}