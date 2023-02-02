import React, { useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Fade,
  Box
} from "@material-ui/core";
import { withRouter } from "react-router-dom";

// styles
import useStyles from "./styles";

import logo from "./logo.png"
// context
import { useUserDispatch, handleLoginUser } from "../../context/UserContext";

function Login(props) {
  var classes = useStyles();

  // global
  var userDispatch = useUserDispatch();

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [servError, setServError] = useState(null);
  var [activeTabId, setActiveTabId] = useState(0);
  var [loginValue, setLoginValue] = useState("enzope32@gmail.com");
  var [passwordValue, setPasswordValue] = useState("asd");

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo"/>
        <Typography type="subtitle1" className={classes.logotypeText}>Midiendo la perfección</Typography>
      </div>
      
      <div className={classes.formContainer}>
        <div className={classes.form}>
          <Tabs
            value={activeTabId}
            onChange={(e, id) => setActiveTabId(id)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Login" classes={{ root: classes.tab }} />
          </Tabs>
          {activeTabId === 0 && (
            <React.Fragment>
              <Typography variant="h1" className={classes.greeting}>
                Sensorial
              </Typography>
              <div className={classes.formDividerContainer}>
                <div className={classes.formDivider} />
                <div className={classes.formDivider} />
              </div>
              <Fade in={error} timeout={1000} >
                <Typography color="secondary" className={classes.errorMessage}>
                  Usuario o password incorrecto
                </Typography>
              </Fade>
              <Fade in={servError} timeout={1000} >
                <Typography color="secondary" className={classes.errorMessage}>
                  Error al intentar conectarse al servidor
                </Typography>
              </Fade>
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={e => setLoginValue(e.target.value)}
                margin="normal"
                placeholder="Username"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <div className={classes.formButtons}>
                <Grid container direction="row" justifyContent="center" alignItems="center" width={325} height={80}> 
                
                <Grid item>
                
                {isLoading ? (
                <Box 
                  display="flex" 
                  width={320} height={80} 
                  alignItems="center"
                  justifyContent="center"
                >   
                  <CircularProgress size={26} className={classes.loginLoader}/>
                  </Box>

                ) : (

                <Box 
                  display="flex" 
                  width={320} height={80} 
                  alignItems="center"
                  justifyContent="center"
                >            
                  <Button justifyContent="center"
                        disabled={
                          loginValue.length === 0 || passwordValue.length === 0
                        }
                        onClick={() =>
                          handleLoginUser(
                            userDispatch,
                            loginValue,
                            passwordValue,
                            props.history,
                            setIsLoading,
                            setError,
                            setServError,
                          )
                        }
                        variant="contained"
                        color="primary"
                        size="large"
                      >
                        Login
                      </Button>
                      </Box>
                )}
                </Grid>
                </Grid>
              </div>
            </React.Fragment>
          )}
        </div>
        </div>
    </Grid>
  );
}

export default withRouter(Login);
