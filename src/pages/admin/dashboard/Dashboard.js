import React, { useState, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  Button,
  Box
} from "@material-ui/core";

// components
import { useUserState } from "../../../context/UserContext";
import { getUserDashboards, getDashboardData, saveIndicator, deleteIndicator, saveObjetivo, deleteObjetivo, updateIndicator } from "../../../api/Api"
import NoDashboard from "../../../components/NoDashboards/NoDashboards";
import SelectedDashboard from "./selected/SelectedDashboard"
import SplitButton from "../../../components/SplitButton/SplitButton";
import Objetivos from "./objetivos/Crearobjetivos";
import Indicadores from "./indicadores/Crearindicadores";
import Notification from "../../../components/Popups/Notification";
import Informes from "./reportes/Reportes";
import ObjetiveChart from "../../../components/Graphs/Objetives";

export default function Dashboard(props) {
  var { isAdmin } = useUserState();

  // local
  var [isLoading, setIsLoading] = useState(true);
  var [dashboardList, setDashboardList] = useState([]);
  var [dashIDs, setDashIds] = useState([]);
  var [indicador, setIndicador] = useState(false);
  var [objetivos, setObjetivos] = useState(false);
  var [mainBoard, setMainBoard] = useState(true);
  var [notificationType, setNotifiactionType] = useState();
  var [notificationMsg, setNotifiactionMsg] = useState();
  var [informe, setInforme] = useState(false);
  var [actualBoardIndicators, setActualBoardIndicators] = useState([]);
  var [actualBoardObjetives, setActualBoardObjetives] = useState([]);
  var [notification, setNotifiaction] = useState();
  var [actualBoardId, setActualBoard] = useState();
  var [isLoadingBoard, setIsLoadingBoard] = useState();

  async function fetchUserDashboards() {
    try {
      const res = await getUserDashboards()
      const {dashboardList, dashIds} = await res.json()
      //console.log(dashboardList)
      //console.log(dashIds)
      if (!!dashboardList) {
        setDashboardList(dashboardList)
        setDashIds(dashIds)
        setActualBoard(dashIds[0])
        setIsLoading(false)
      } 

    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => { 
    async function getInitialBoards(){
      console.log("fetch user dashboards")
      fetchUserDashboards()
    }
    getInitialBoards();

  },[]);

  async function fetchDashboardData() {
    try {
      const res = await getDashboardData(actualBoardId)
      if (!!res && res.ok) {
        const data = await res.json()
        console.log(data)
        setActualBoardObjetives(data.objetives)
        setActualBoardIndicators(data.indicators)
      }
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => { 
    async function getInitialData(){
      console.log("fetch dashboard initial data")
      if(!!actualBoardId){
        setIsLoadingBoard(true)
        await fetchDashboardData()
        setIsLoadingBoard(false)
      }
    }
    getInitialData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[actualBoardId]);

  /******NOTIFICATIONS******/
  useEffect(() => { 
    async function automatedClose(){
      if(notification)
        setTimeout(() => {setNotifiaction(false)} , 4000);   
    }
    automatedClose();

  },[notification]);

  const handleNotifications = (type, msg) => {
    setNotifiaction(true)
    setNotifiactionType(type)
    setNotifiactionMsg(msg)
  }

    /*********INDICATORS********/
    const handleCreateIndicator = async (sensors, nombre, tipoIndicador, inferior, superior, refreshRate, selectedSensors) => {

      let sensorNames = await Promise.all(sensors.map(sensor => sensor.nombre))
      let indexArr = await Promise.all(selectedSensors.map(sensorName => sensorNames.indexOf(sensorName)))
      let arrSelectedSensorIds = await Promise.all(indexArr.map(index => sensors[index])
      )
  
      let newIndicator = {
        name: nombre,
        type: tipoIndicador,
        sensors: arrSelectedSensorIds,
        refreshRate: refreshRate
      }

      if(!!inferior)
        newIndicator= {...newIndicator, limitInferior: inferior }
      
      if(!!superior)
        newIndicator= {...newIndicator, limitSuperior: superior }

      let res = await saveIndicator(actualBoardId,newIndicator)
      if(!!res && res.ok){
        console.log("save indicator")
        const data = await res.json()
        console.log(data)
        handleNewNotification("Indicador creado exitosamente","success")
        setActualBoardIndicators(actualBoardIndicators => actualBoardIndicators.concat(data))
        handleClose()
        return {boardId: actualBoardId, ...data}
      } else {
        handleNewNotification("No se pudo crear el indicador","error")
      }    
    };
  
    const handleUpdateIndicator = async (sensors, nombre, tipoIndicador, inferior, superior, refreshRate, selectedSensors, indicatorId) => {

      let sensorNames = await Promise.all(sensors.map(sensor => sensor.nombre))
      let indexArr = await Promise.all(selectedSensors.map(sensorName => sensorNames.indexOf(sensorName)))
      let arrSelectedSensorIds = await Promise.all(indexArr.map(index => sensors[index])
      )
  
      let newIndicator = {
        _id: indicatorId,
        name: nombre,
        type: tipoIndicador,
        sensors: arrSelectedSensorIds,
        refreshRate: refreshRate
      }

      console.log(newIndicator)

      if(!!inferior)
        newIndicator= {...newIndicator, limitInferior: inferior }
      
      if(!!superior)
        newIndicator= {...newIndicator, limitSuperior: superior }

      let res = await updateIndicator(actualBoardId,newIndicator,indicatorId)
      if(!!res && res.ok){
        const data = await res.json()
        handleNewNotification("Indicador actualizado exitosamente","success")
        setActualBoardIndicators(data)
        handleClose()
        return {boardId: actualBoardId, data: data}
      } else {
        handleNewNotification("No se pudo actualizar el indicador","error")
      }    
    };

    const replaceIndicator = async (actualBoardIndicators, newIndicator, indicatorId) => {
      console.log(actualBoardIndicators)
      console.log(newIndicator)
      for (let i in actualBoardIndicators) {
        if(actualBoardIndicators[i]._id == newIndicator._id) {
          actualBoardIndicators[i] = newIndicator
          console.log(actualBoardIndicators)
          return actualBoardIndicators
        }
        console.log(actualBoardIndicators)

        return actualBoardIndicators
      }

    }

    const handleDeleteIndicator = async (indId) => {
      try {
        let arrObjsXInd = actualBoardObjetives.filter(objetive => objetive.indicatorId===indId)
        if(arrObjsXInd.length) {
          handleNotifications("error","No se puede borrar: Existen objetivos asociados a este indicador")
        } else {
          let res = await deleteIndicator(actualBoardId,indId)
            if (!!res && res.ok) {
              handleNotifications("success","Indicador borrado exitosamente")
              console.log(actualBoardIndicators)
              setActualBoardIndicators(actualBoardIndicators => actualBoardIndicators.filter(indData => indData._id !== indId))
              return {boardId: actualBoardId, indId: indId}
            } else {
              handleNotifications("error","No se pudo borrar el indicador")
            }
          }
      } catch (e) {
        console.log(e)
      }
    }
  
    /*********OBJETIVES*********/
    const handleCreateObjetive = async (nombre, description, objValue, startDate, endDate, indicatorName, indicatorId) => {
      //startDate: (!!startDate && !!startTime ) ? new Date(`${startDate}T${startTime}`) : new Date(Date.now()),
      let newObj = {
        name: nombre,
        description: description,
        value: objValue,
        startDate: (!!startDate) ? new Date(startDate) : new Date(Date.now()),
        endDate: new Date(endDate),
        indicatorName: indicatorName, 
        indicatorId: indicatorId,
      }
      let res = await saveObjetivo(actualBoardId,newObj)
      if (!!res && res.ok){
        handleNewNotification("Objetivo creado exitosamente","success")
        const data = await res.json()
        console.log("NeW OBJETIVE")
        console.log(data)
        setActualBoardObjetives(actualBoardObjetives => actualBoardObjetives.concat(data))
        handleClose()
        return {boardId: actualBoardId, ...data}
      } else {
        handleNewNotification("Error al intentar crear el objetivo","error")
        return false
      }
  }
  
  const handleDeleteObjetive = async (arrObjId) => {
    try {
      console.log("Antes de borrar todo")
      for (let objId of arrObjId) {
        await deleteObjetivo(actualBoardId,objId)
      }
      //await Promise.all(arrObjId.map(objId => deleteObjetivo(actualBoardId,objId)))
      console.log("Borro todo")
      if (arrObjId.length>1) {
        handleNotifications("success","Objetivos borrados exitosamente")
      } else {
        handleNotifications("success","Objetivo borrado exitosamente")
      }

      setActualBoardObjetives(actualBoardObjetives => actualBoardObjetives.filter(objData => !arrObjId.includes(objData._id)))
      return {boardId: actualBoardId, arrObjId: arrObjId}
    } catch(e) {
        handleNotifications("error","Error al intentar borrar el objetivo")
    }
  }

  /*********Listerners*********/
  async function handleUpdateNewObjetive(objData) {
    try {
      console.log(objData.boardId)
      console.log(actualBoardId)
      if(objData.boardId == actualBoardId){
        handleNotifications("warning","Tablero modificado: objetivo creado")
        setActualBoardObjetives(actualBoardObjetives => actualBoardObjetives.concat(objData))
      }
    } catch(error) {
      console.log(error)
    }
  }

  const handleUpdateDeletedObjetive = async (objData) => {
    try{ 
      console.log(objData.boardId)
      console.log(actualBoardId)
      if(objData.boardId == actualBoardId){
        handleNotifications("warning","Tablero modificado: objetivo borrado")
        for (let objId of objData.arrObjId)
          setActualBoardObjetives(actualBoardObjetives => actualBoardObjetives.filter(o => objId!=o._id))
      }
    } catch(error) {
      console.log(error)
    }
  }

  async function handleUpdateaddIndicator(indData) {
    try {
      console.log(indData.boardId)
      console.log(actualBoardId)
      if(indData.boardId == actualBoardId){
        handleNotifications("warning","Tablero modificado: indicador creado")
        setActualBoardIndicators(actualBoardIndicators => actualBoardIndicators.concat(indData))
      }
    } catch(error) {
      console.log(error)
    }
  }

  async function handleUpdateUpdatedIndicator(indData) {
    try {
      console.log(indData.boardId)
      console.log(actualBoardId)
      if(indData.boardId == actualBoardId){
        console.log(indData)
        handleNotifications("warning","Tablero modificado: indicador actualizado")
        setActualBoardIndicators(indData.data)
      }
    } catch(error) {
      console.log(error)
    }
  }

  const handleUpdateDeletedIndicator = async (indData) => {
    try{ 
      if(indData.boardId == actualBoardId){
        handleNotifications("warning","Tablero modificado: indicador borrado")
        setActualBoardIndicators(actualBoardIndicators => actualBoardIndicators.filter(boardData => boardData._id !== indData.indId))
      }
    } catch (error) {
      console.log(error)
    }
  }

  /****NOTIFICATION****/
  const handleNewNotification = async (msg,type) => {
    setNotifiactionType(type)
    setNotifiactionMsg(msg)
    setNotifiaction(true)
  }
  
  /*********VIEWS*********/
  const handleClose = () => {
    setMainBoard(true)
    setInforme(false)
    setIndicador(false)
    setObjetivos(false)
  }

  const handleInforme = () => {
    setMainBoard(false)
    setInforme(true)
    setIndicador(false)
    setObjetivos(false)
  }

  const handleSelectedboard = () => {
    setMainBoard(true)
    setInforme(false)
    setIndicador(false)
    setObjetivos(false)
  }

  const handleIndicador = () => {
    setMainBoard(true)
    setInforme(false)
    setIndicador(true)
    setObjetivos(false)
  }

  const handleObjetivos = () => {
    setMainBoard(true)
    setInforme(false)
    setIndicador(false)
    setObjetivos(true)
  }

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
        dashboardList.length===0 ? 
          <NoDashboard isAdmin={isAdmin} setDashboardList={setDashboardList} setDashIds={setDashIds}/> : 
          <div>
            <Grid container spacing={1} >
              <Grid container item xs={12} sm={12} md={6} lg={6} >
                <Grid container item xs={6} sm={6} md={6} lg={6} justifyContent="center" >
                {
                  isAdmin && <Button variant="contained" color="primary" onClick={handleIndicador}>
                    Indicador
                  </Button>
                  }
                </Grid>
                <Grid container item xs={6} sm={6} md={6} lg={6} justifyContent="center">
                {  
                  isAdmin && 
                    <Button variant="contained" color="primary" onClick={handleObjetivos}>
                      Objetivo
                    </Button>
                }
                </Grid>
              </Grid>

              <Grid container item xs={12} sm={12} md={6} lg={6} >
                <Grid container item xs={6} sm={6} md={6} lg={6} justifyContent="center">
                  
                {
                  isAdmin && 
                    <Button variant="outlined" color="secondary" onClick={handleInforme}>
                      Reportes
                    </Button>
                }
                </Grid>
                <Grid container item xs={6} sm={6} md={6} lg={6} justifyContent="center">
                {
                  <SplitButton list={dashboardList} 
                    dashIDs={dashIDs} 
                    setActualBoard={setActualBoard} 
                    backToBoardView={handleSelectedboard}/> }
                </Grid>   
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="space-between" m={1} p={0}>
            </Box> 
            <Notification notificationMsg={notificationMsg} 
            severity={notificationType} 
            notification={notification} 
            setNotifiaction={setNotifiaction}/>
            {
              informe && <Informes 
              dashboardId={actualBoardId} 
              handleNewNotification={handleNewNotification}/>
            }
            {
              (!isLoadingBoard && mainBoard) && <SelectedDashboard 
                dashIDs={dashIDs}
                dashboardList={dashboardList}
                handleNewNotification={handleNewNotification}
                handleUpdateNewObjetive={handleUpdateNewObjetive}
                handleUpdateDeletedObjetive={handleUpdateDeletedObjetive}
                handleUpdateaddIndicator={handleUpdateaddIndicator}
                handleUpdateUpdatedIndicator={handleUpdateUpdatedIndicator}
                handleUpdateDeletedIndicator={handleUpdateDeletedIndicator}
                setActualBoardIndicators={setActualBoardIndicators}
                handleClose={handleClose}
                actualBoardIndicators={actualBoardIndicators}
                actualBoardObjetives={actualBoardObjetives}
                indicador={indicador}
                objetivos={objetivos}
                handleCreateObjetive={handleCreateObjetive}
                handleDeleteObjetive={handleDeleteObjetive}
                handleDeleteIndicator={handleDeleteIndicator}
                handleCreateIndicator={handleCreateIndicator}
                actualBoardId={actualBoardId}
                handleUpdateIndicator={handleUpdateIndicator}
              />
            }
          </div>
    }
    </>
  );
}
