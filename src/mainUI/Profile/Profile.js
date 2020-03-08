import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Paper from '@material-ui/core/Paper';
import Rating from '@material-ui/lab/Rating';
import Title from './Title';

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);

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
export default function Profile(props) {
    /**
   * @var classes Calls Material-UI useStyles to generate/inherit material UI styles generated from a default theme
   */
    const classes = useStyles();

    const calculateRating = (ratingArray) => {

    };

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
            {props.userID.name}
          </Typography>
          <Title>Rating</Title>
          {!props.userID.avgScore || props.userID.avgScore.length == 0 ?
            <Title>You haven't been rated yet</Title>
            :
            <StyledRating
              name="customized-color"
              defaultValue={props.userID.avgScore}
              getLabelText={value => `${value} Heart${value !== 1 ? 's' : ''}`}
              precision={0.5}
              icon={<FavoriteIcon fontSize="inherit" />}
              />
          }
        </div>
        </Paper>
        </Grid>
      </Container>
    );
  }

