import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Button,
} from "@material-ui/core";
// styles

// components
import VariacionOntime from "../../../../components/Graphs/VariacionOnTime";
import VerticalBar from "../../../../components/Graphs/BarGraphVertical";
import BarrasChar from "../../../../components/Graphs/BarrasGraph";
import GrupalGraphs from "../../../../components/Graphs/GrupalGraphs";
import SimpleRadarChart from "../../../../components/Graphs/SimpleRadarChart";
import HistoricalChart from "../../../../components/Graphs/HistoricChart";
import ObjetiveChart from "../../../../components/Graphs/Objetives";
import EmptyDashboard from "../../../../components/EmptyDashboards/EmptyDashboards";
import CircularGraph from "../../../../components/Graphs/CircularGraph";
import HorizontalBar from "../../../../components/Graphs/BarGraphHorizontal";
import SplitButton from "../../../../components/SplitButton/SplitButton";
import CircularGraphCustom from "../../../../components/Graphs/CircularGraphCustom";
import { useUserState } from "../../../../context/UserContext";
import {useInterval} from "../../../../utils/customhooks";
import Informes from "../reportes/Reportes";
import Objetivos from "../objetivos/Crearobjetivos";
import Indicadores from "../indicadores/Crearindicadores";
import {getDashboardData,deleteIndicator,deleteObjetivo} from '../../../../api/Api';
import Notification from "../../../../components/Popups/Notification";
import io from 'socket.io-client';
import {saveIndicator, saveObjetivo} from '../../../../api/Api'

export default function SelectedDashboard(props) {
  var { isAdmin } = useUserState();
  var [historic, setHistoric] = useState(false);
  var [historicIndicator, setHistoricIndicator] = useState()
  var [socket, setSocket] = useState(null);

  var [actualBoardId, setActualBoard] = useState(props.dashIDs[0]);

  useEffect(() => { 
    const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080"
    const newSocket = io(BASE_URL);
    setSocket(newSocket);
    newSocket.on("connect", () => {  console.log(newSocket.id); }); // x8WIv7-mJelg7on_ALbx});
    newSocket.on("newIndicator", props.handleUpdateaddIndicator)
    newSocket.on("deleteIndicator", props.handleUpdateDeletedIndicator)
    newSocket.on("newObjetive", props.handleUpdateNewObjetive)
    newSocket.on("deleteObjetive", props.handleUpdateDeletedObjetive)
    newSocket.on("updateIndicator", props.handleUpdateUpdatedIndicator)

    return () => newSocket.close();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const handleCreateObjetive = async (nombre, description, objValue, startDate, endDate, indicatorName, indicatorId) => {
    let result = await props.handleCreateObjetive(nombre, description, objValue, startDate, endDate, indicatorName, indicatorId)
    if(!!result)
      socket.emit('newObjetive', result);
  }

  const handleDeleteObjetive = async (arrObjId) => {
    let result = await props.handleDeleteObjetive(arrObjId)
    if(!!result)
      socket.emit('deleteObjetive', result);
  }

  const handleCreateIndicator = async (sensors, nombre, tipoIndicador, inferior, superior, refreshRate, selectedSensors) => {
    let result = await props.handleCreateIndicator(sensors, nombre, tipoIndicador, inferior, superior, refreshRate, selectedSensors)
    if(!!result)
      socket.emit('newIndicator', result);  
  }

  const handleDeleteIndicator = async (indId) => {
    let result = await props.handleDeleteIndicator(indId)
    if(!!result)
      socket.emit('deleteIndicator', result);
  }

  const handleUpdateIndicator = async (sensors, nombre, tipoIndicador, inferior, superior, refreshRate, selectedSensors, indicatorId) => {
    let result = await props.handleUpdateIndicator(sensors, nombre, tipoIndicador, inferior, superior, refreshRate, selectedSensors, indicatorId)
    if(!!result)
      socket.emit('updateIndicator', result);  
  }
  
  /************FUNCTIONS************/
  function GraphPerType(indicator) {
    if (indicator.sensors.length===1){
      return <VariacionOntime 
       actualBoardId={props.actualBoardId} 
       setHistoric={setHistoric} 
       setHistoricIndicator={setHistoricIndicator} 
       handleDeleteIndicator={handleDeleteIndicator}
       handleUpdateIndicator={handleUpdateIndicator}
       indicator={indicator}
       />
    } else {
      switch (indicator.type) {
        case "produccion":
          return <CircularGraph 
          actualBoardId={props.actualBoardId} 
          setHistoric={setHistoric} 
          setHistoricIndicator={setHistoricIndicator} 
          handleDeleteIndicator={handleDeleteIndicator} 
          handleUpdateIndicator={handleUpdateIndicator}
          indicator={indicator}/>
        case "humedad":
          return <HorizontalBar 
          actualBoardId={props.actualBoardId} 
          setHistoric={setHistoric} 
          setHistoricIndicator={setHistoricIndicator} 
          handleDeleteIndicator={handleDeleteIndicator} 
          handleUpdateIndicator={handleUpdateIndicator}
          indicator={indicator}/>
        case "temperatura":
          return <GrupalGraphs 
          actualBoardId={props.actualBoardId} 
          setHistoric={setHistoric} 
          setHistoricIndicator={setHistoricIndicator} 
          handleDeleteIndicator={handleDeleteIndicator} 
          handleUpdateIndicator={handleUpdateIndicator}
          indicator={indicator}/>
        case "calidad_del_aire":
          return <VerticalBar 
          actualBoardId={props.actualBoardId} 
          setHistoric={setHistoric} 
          setHistoricIndicator={setHistoricIndicator} 
          handleDeleteIndicator={handleDeleteIndicator} 
          handleUpdateIndicator={handleUpdateIndicator}
          indicator={indicator}/>
        default:
      }
    }
  }
 
  return (
    <>
      {
      <div>
         <Grid container spacing={2}>
          {
          <Indicadores 
            handleNewNotification={props.handleNewNotification} 
            isOpen={props.indicador} 
            handleClose={props.handleClose} 
            dashboardId={actualBoardId} 
            tipo={"Crear"}
            titulo={"Nuevo Indicador"}
            handleCreate={handleCreateIndicator}
          />
          }
          {
          <Objetivos 
            handleNewNotification={props.handleNewNotification} 
            isOpen={props.objetivos} 
            handleCreateObjetive={handleCreateObjetive}
            handleClose={props.handleClose} 
            dashboardId={actualBoardId} 
            handleUpdateNewObjetive={props.handleUpdateNewObjetive} 
            actualBoardInd={props.actualBoardIndicators}
          />
          }

          {
            props.actualBoardIndicators.length===0 && <EmptyDashboard/>
          }

          {
            !!props.actualBoardIndicators.length>0 && props.actualBoardIndicators.map((indicator, index) => GraphPerType(indicator))
          }
                      {
          props.actualBoardObjetives.length>0 && <ObjetiveChart isAdmin={isAdmin} 
                objetives={props.actualBoardObjetives} 
                actualBoardId={props.actualBoardId} 
                handleDeleteObjetive={handleDeleteObjetive}
                handleUpdateDeletedObjetive={props.handleUpdateDeletedObjetive}
              />
            }
          { 
            historic && <HistoricalChart setHistoric={setHistoric} isOpen={historic} historicIndicator={historicIndicator} actualBoardId={props.actualBoardId}/>
          }
        </Grid>
      </div>
    }
    </>
  );
}


