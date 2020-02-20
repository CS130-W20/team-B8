import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SimpleMap from './simpleMap';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    paperElement: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        height: "100%",
    }
}));

export default function GMap() {
    const classes = useStyles();
    return(
        <Grid data-testid="Map" container spacing={3} style={{height: "80vh"}}>
            {/* Map */}
            <Grid item xs={12} md={8} lg={9} style={{height: "100%"}}>
                <Paper className={classes.paperElement}>
                    <SimpleMap />
                </Paper>
            </Grid>
            {/* Map Settings? */}
            <Grid item xs={12} md={4} lg={3}>
                <Paper className={classes.paperElement}>
                </Paper>
            </Grid>
        </Grid>
  )};