import React from "react";
import {
  Grid,
} from "@material-ui/core";

import CheckboxTable from "../Table/CheckboxTable"
// styles

// components



export default function ObjetiveChart(props) {
        //var { isAdmin } = useUserState();
    return (
          <Grid item xs={12}>
              <CheckboxTable 
                isAdmin={props.isAdmin} 
                actualBoardId={props.actualBoardId} 
                handleDeleteObjetive={props.handleDeleteObjetive} 
                data={props.objetives} 
                handleUpdateDeletedObjetive={props.handleUpdateDeletedObjetive}/>
          </Grid>
    );
}

