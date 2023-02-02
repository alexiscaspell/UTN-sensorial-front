import React, { useState, useEffect } from "react";
import { Grid, Box, CircularProgress } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { getAllReportes, getAllUsersData, deleteReport } from "../../../../api/Api"
import SimpleModal from './crearreporte/crearreporte'


export default function Informes(props) {

  var [reportList, setReportsData] = useState([]);
  var [isLoading, setIsLoading] = useState(true);
  var [destinatarios, setDestinarios] = useState();


  async function fetchDashboardReports() {
    try {
      const res = await getAllReportes(props.dashboardId)
      const {data} = await res.json()
      if (!!data) {
        setReportsData(data)
      }
      setIsLoading(false)
    } catch(error) {
      console.log(error)
    }

  }

  async function fetchDests() {
    const res = await getAllUsersData()
    const {data} = await res.json()
    if (!!data) {
      let dest = []
      for (let user of data){
        dest.push(user[0])
      }
      setDestinarios(dest)
    }
  }

  useEffect(() => { //tiene que haber un useEffect por cada variable de estado de chart a modificar
    async function getInitialReports(){
      await fetchDashboardReports()
      await fetchDests()
    }
    getInitialReports();

  },[]);

  async function handleDeleteReports(reportsToDelete) {
    try {
      var reportsIndex = await Promise.all(reportsToDelete.map(item => item.index))
      var reportsIds = await Promise.all(reportsIndex.map(index => reportList[index][5]))
      await Promise.all(reportsIds.map(reportId => deleteReport(props.dashboardId,reportId)))

      var filtered = reportList.filter(function(value,index){
        return !reportsIndex.includes(index)
      })
      props.handleNewNotification("Reporte borrado exitosamente","success")

      setReportsData(filtered)

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
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <MUIDataTable
              title={
                    <Box display="flex" justifyContent="flex-start" m={0} p={0} >
                      {!!destinatarios && <SimpleModal handleNewNotification={props.handleNewNotification} reportList={reportList} setReportsData={setReportsData} dashboardId={props.dashboardId} destinatarios={destinatarios}/>}
                    </Box>
                    }
              data={reportList}
              columns={["Nombre", "Descripcion", "Destinatarios", "Dia", "Horario (Hs)"]}
              options={{
                filterType: "checkbox",
                print: false,
                download: false,
                viewColumns: false,
                onRowsDelete: (rowsDeleted, newTableData) => {  
                  return handleDeleteReports(rowsDeleted.data)
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
