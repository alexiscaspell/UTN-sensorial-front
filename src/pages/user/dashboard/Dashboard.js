import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  CircularProgress
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
// styles
import useStyles from "./styles";

// components
import SplitButton from "../../../components/SplitButton/SplitButton";
import { useUserState } from "../../../context/UserContext";
import { getUserDashboards, getDashboardData } from "../../../api/Api"
import NoDashboard from "../../../components/NoDashboards/NoDashboards";
import SelectedDashboard from "../../admin/dashboard/selected/SelectedDashboard"


export default function Dashboard(props) {
  var classes = useStyles();
  var theme = useTheme();
  var { isAdmin } = useUserState();

  // local
  var [mainBoard, setMainBoard] = useState(true);
  var [informe, setInforme] = useState(false);
  var [indicador, setIndicador] = useState(false);
  var [objetivos, setObjetivos] = useState(false);
  var [isLoading, setIsLoading] = useState(true);
  var [atualBoardId, setActualBoard] = useState();
  var [actualBoardData, setActualBoardData] = useState();
  var [dashboardList, setDashboardList] = useState([]);
  var [dashIDs, setDashIds] = useState([]);


  async function fetchUserDashboards() {
    try {
      const res = await getUserDashboards()
      if (res.ok){
        console.log("entra al fetch dashbords")
        const {dashboardList, dashIds} = await res.json()
        console.log(dashboardList)
        console.log(dashIds)
        setDashboardList(dashboardList)
        setDashIds(dashIds)
        setActualBoard(dashIds[0])
        setIsLoading(false)
      }
      //setIsoList(await Promise.all(nearOrder.map(n => n.iso2)))
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => { //tiene que haber un useEffect por cada variable de estado de chart a modificar
    async function getInitialBoards(){
      await fetchUserDashboards()
    }
    getInitialBoards();

  },[]);

  async function fetchDashboardData() {
    try {
      if(!!atualBoardId){
        const res = await getDashboardData(atualBoardId)
        const data = await res.json()
        setActualBoardData(data)
      }


    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => { //tiene que haber un useEffect por cada variable de estado de chart a modificar
    async function getInitialData(){
      if(!!atualBoardId){
        await fetchDashboardData()
      }
    }
    getInitialData();

  },[atualBoardId]);

  const handleSelectedboard = () => {
    setMainBoard(true)
    setInforme(false)
    setIndicador(false)
    setObjetivos(false)
  }

  async function fetchDashboardData() {
    try {
      const res = await getDashboardData()
      const data = await res.json()
      console.log(data)
      setActualBoardData(data)
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => { //tiene que haber un useEffect por cada variable de estado de chart a modificar
    async function getInitialData(){
      await fetchDashboardData()
      setIsLoading(false);
    }
    getInitialData();

  },[atualBoardId]);
  
  return (
    <>
      {
        isLoading ? <Grid
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
        dashboardList.length === 0 ? 
          <NoDashboard isAdmin={isAdmin} setDashboardList={setDashboardList} setDashIds={setDashIds} setActualBoard={setActualBoard}/> : 
        <div>
          <Box display="flex" justifyContent="flex-end" m={1} p={1}>
            <Box p={1}>
              <SplitButton list={dashboardList} 
                dashIDs={dashIDs} 
                setActualBoard={setActualBoard} 
                backToBoardView={handleSelectedboard}/>
            </Box>
          </Box>
      <Grid container spacing={4}>
        {
          (mainBoard && !!actualBoardData) && <SelectedDashboard actualBoardData={actualBoardData} />
        }
      </Grid>
      </div>
      }
    </>
  );
}

// #######################################################################

