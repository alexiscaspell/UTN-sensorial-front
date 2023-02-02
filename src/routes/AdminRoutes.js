import React from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
import Header from "../components/Header/Header";
import SidebarAdmin from "../components/Sidebar/SidebarAdmin";

// pages
import Dashboard from "../pages/admin/dashboard/Dashboard";
import Tableros from "../pages/admin/tableros/Tableros";
import Usuarios from "../pages/admin/usuarios/Usuarios";

// context
import { useLayoutState } from "../context/LayoutContext";
import { useUserState } from "../context/UserContext";

function LayoutAdmin(props) {
  var classes = useStyles();
  var { isAdmin } = useUserState();
  // global
  var layoutState = useLayoutState();

  return (
    <div className={classes.root}>
        <>
          <Header history={props.history} />
          {isAdmin && <SidebarAdmin />}
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
              <Route path="/app/dashboards" component={Dashboard}/>
              <Route path="/app/tableros" component={Tableros}/>
              <Route path="/app/usuarios" component={Usuarios}/>
            </Switch>
          </div>
        </>
    </div>
  );
}

export default withRouter(LayoutAdmin);