import React, { useState, useEffect } from "react";
import { Grid, Box, Button, CircularProgress } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { getAllDashboardsData, deleteDashboards, getAllUsersData } from "../../../api/Api"
import SimpleModal from './creartablero/creartablero'
import Notification from "../../../components/Popups/Notification";
import {parseDate} from "../../../utils/utils"

export default function Tableros() {

  var [dashboardList, setDashboardList] = useState([]);
  var [isLoading, setIsLoading] = useState(true);
  var [notification, setNotifiaction] = useState();
  var [notificationType, setNotifiactionType] = useState();
  var [notificationMsg, setNotifiactionMsg] = useState();

  const handleNewNotification = async (msg,type) => {
    setNotifiactionType(type)
    setNotifiactionMsg(msg)
    setNotifiaction(true)
  }

  useEffect(() => { 
    async function automatedClose(){
      if(notification)
        await setTimeout(() => {setNotifiaction(false)} , 4000);
        
    }
    automatedClose();

  },[notification]);

  async function fetchDashboardsData() {
    try {
      const res = await getAllDashboardsData()
      const {data} = await res.json()
      if (!!data) {
        let formatedDate = await Promise.all(data.map(dash => {
          dash[2] = parseDate(dash[2])
          return dash
        }))
        setDashboardList(formatedDate)
      }
      setIsLoading(false)
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => { //tiene que haber un useEffect por cada variable de estado de chart a modificar
    async function getInitialDashs(){
      await fetchDashboardsData()
    }
    getInitialDashs();

  },[]);

  async function handleDeleteDashabords(dashboardToDelete) {
    try {
      var dashboardIndex = await Promise.all(dashboardToDelete.map(item => item.index))
      var dashboasrdId = await Promise.all(dashboardIndex.map(index => dashboardList[index][3]))
      await Promise.all(dashboasrdId.map(dashid => deleteDashboards(dashid)))

      var filtered = dashboardList.filter(function(value,index){
       return !dashboardIndex.includes(index)
      })

      if(dashboardToDelete.length>1) {
        handleNewNotification("Tableros borrados exitosamente","success")
      } else {
        handleNewNotification("Tablero borrado exitosamente","success")
      }

      setDashboardList(filtered)

    } catch(error) {
      console.log(error)
    }
  }

  return (
    <>
      {
        isLoading ? 
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '80vh' }}
        >
        <Grid item xs={3}>
          <CircularProgress size={100}/>
        </Grid>   
      </Grid> :
      <div>
       <Notification notificationMsg={notificationMsg} severity={notificationType} notification={notification} setNotifiaction={setNotifiaction}/>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <MUIDataTable
              title={
                    <Box display="flex" justifyContent="flex-start" m={0} p={0} >
                      <SimpleModal handleNewNotification={handleNewNotification} dashboardList={dashboardList} setDashboardList={setDashboardList}/>
                    </Box>
                    }
              data={dashboardList}
              columns={["Nombre", "Descripción", "Fecha de creación"]}
              options={{
                filterType: "checkbox",
                print: false,
                download: false,
                viewColumns: false,
                onRowsDelete: (rowsDeleted, newTableData) => {  
                  return handleDeleteDashabords(rowsDeleted.data)
                },
              }}
            />
          </Grid>
        </Grid>

      </div>
    }
    </>
  );
}
