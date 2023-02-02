import React from "react";
import {
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
import Header from "../components/Header/Header";

// pages
import Dashboard from "../pages/admin/dashboard/Dashboard";

// context
import { useLayoutState } from "../context/LayoutContext";

function LayoutUser(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();

  return (
    <div className={classes.root}>
        <>
          <Header history={props.history} />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
              <Route path="/app/dashboards" component={Dashboard} />
            </Switch>
          </div>
        </>
    </div>
  );
}

export default withRouter(LayoutUser);