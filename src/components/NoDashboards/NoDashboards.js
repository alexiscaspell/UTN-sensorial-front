import React from "react";
import {
  Button,
  Box
} from "@material-ui/core";
import PageTitle from "../PageTitle/PageTitle";
import SimpleModal from "../Creartablero/Creartablero"

export default function NoDashboard(props) {


  return (
    <>
        <Box display="flex" justifyContent="center" m={0} p={15} >
          <Box m="auto">
            {
              props.isAdmin ? <PageTitle title="No hay ningun tablero disponible, comenzá creando uno."/> : <PageTitle title="No hay ningun tablero disponible."/>
            } 
          </Box>
        </Box>
        <Box 
          display="flex" 
          alignItems="center"
          justifyContent="center"
        >
        </Box>
        {
          /*props.isAdmin && <Box display="flex" justifyContent="center" m={1} p={1} >
            <SimpleModal setDashIds={props.setDashIds} setDashboardList={props.setDashboardList}/>
          </Box>*/
        } 
    </>
  );
}

