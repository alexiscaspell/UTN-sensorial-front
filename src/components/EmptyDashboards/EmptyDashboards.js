import React from "react";
import {
  Button,
  Box
} from "@material-ui/core";
import PageTitle from "../PageTitle/PageTitle";
import SimpleModal from "../Creartablero/Creartablero"
import { useUserState } from "../../context/UserContext";

export default function EmptyDashboard(props) {
  var { isAdmin } = useUserState();


  return (
    <>        
        <Box display="flex" justifyContent="center" m={0} p={30}>
          <Box p={0} >
            { isAdmin ? <PageTitle title="El tablero esta vacío, comenzá creando un indicador."/> : <PageTitle title="El tablero esta vacío"/>}
          </Box>
        </Box>
    </>
  );
}

