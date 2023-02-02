import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

// components

// pages
import Error from "../pages/error";
import Login from "../pages/login";
import LayoutUser from "../routes/UserRoutes";
import LayoutAdmin from "../routes/AdminRoutes";

// context
import { useUserState } from "../context/UserContext";

export default function App() {
  // global
  var { isAuthenticated, isAdmin } = useUserState();

  return (
      <HashRouter>
        <Switch>
          <PublicRoute exact path="/" />
          <Route
            exact
            path="/app"
            render={() => <Redirect to="/app/dashboards" />}
          />
          <PrivateRoute path="/app/"/>
          <PublicRoute path="/login" component={Login} />
          <Route component={Error} />
        </Switch>
      </HashRouter>
  );

  // #######################################################################

  function PrivateRoute({ component, ...rest }) {
    console.log("private route")
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            isAdmin ? (
              React.createElement(LayoutAdmin, props)
            ) : (
              React.createElement(LayoutUser, props)
            )
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    console.log("public route")
    return (
      <Route
        {...rest}
        render={props =>
          !isAuthenticated ? (
            React.createElement(Login, props)
          ) : 

              <Redirect
              to={{
                pathname: "/app/dashboards",
                state: { from: props.location }
              }}
            />

        }
      />
    );
  }
}
