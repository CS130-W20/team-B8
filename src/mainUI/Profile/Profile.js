import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Title from './Title';

/**
 * @var useStyle Function object that generates a style off of default MaterialsUI Theme
 * @see https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/dashboard
 * @see https://material-ui.com/styles/basics/
 */
const useStyles = makeStyles(theme => ({
    paper: {
      paddingTop: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
}));

/**
 * Function component that uses Google Material UI
 * Displays a simple user profile 
 * Still working in progress as we have yet to integrate with database/backend
 * 
 * @author Phipson Lee
 * @since 2020-02-15
 */
export default function Profile() {
    /**
   * @var classes Calls Material-UI useStyles to generate/inherit material UI styles generated from a default theme
   */
    const classes = useStyles();
  
    /**
   * Renders User profile onto screen
   */
    return (
      <Container data-testid="Profile" component="main" maxWidth="xs">
        <Grid item xs={12}>
            <Paper className={classes.paper} style={{padding: '10% 0'}}>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" style={{padding: '10% 0'}}>
            Your Name
          </Typography>
          <Title>Your Events</Title>
          <Title>Your Rating</Title>
        </div>
        </Paper>
        </Grid>
      </Container>
    );
  }

