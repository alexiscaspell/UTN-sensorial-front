import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function Notification(props) {
    const position = {
        vertical: 'top',
        horizontal: 'center',
      };
    const { vertical, horizontal } = position;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    props.setNotifiaction(false);
  };

    const useStyles = makeStyles((theme) => ({
        root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
        },
    }));
    const classes = useStyles();


  return (
    <div className={classes.root}>
      <Snackbar open={props.notification} onClose={handleClose} anchorOrigin={{ vertical, horizontal }}
>
        <Alert onClose={handleClose} autoHideDuration={6000} severity={props.severity}>
          {props.notificationMsg}
        </Alert>

      </Snackbar>
      {
        /*<Alert severity="error">This is an error message!</Alert>
        <Alert severity="warning">This is a warning message!</Alert>
        <Alert severity="info">This is an information message!</Alert>
        <Alert severity="success">This is a success message!</Alert>*/
      }
    </div>
  );
}
