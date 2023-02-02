import React, { useState, useEffect } from "react";
import {
  Grid,
  LinearProgress,
  Box
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import Dot from "../Sidebar/components/Dot";

import useStyles from "./styles";
import {handleProgressColor} from "../../utils/utils"
import {useInterval} from "../../utils/customhooks"

// components

import Widget from "../Widget/Widget";
import { Typography } from "../Wrappers/Wrappers";
import {getIndicatorData} from '../../api/Api'
import {CustomTooltip} from "../CustomTooltip/CustomTooltip"

export default function BarrasChar(props) {
    var classes = useStyles();
    var theme = useTheme();
    const [sensData, setData] = useState();

    
    const handleDeleteIndicator = () => {
      props.handleDeleteIndicator(props.indicator._id)
    }

    const handleSetHistoric = () => {
      props.setHistoricIndicator(props.indicator)
      props.setHistoric(true)
    }

    const handleFetchIndicatorData = async (muestras) => {
      let res = await getIndicatorData(props.actualBoardId,props.indicator._id,muestras)
      if(!!res && res.ok) {
        let data = await res.json()
          setData(data)
        }      
      /*if (res.status == 409) {
        props.handleUpdateDeletedIndicator(props.indicator._id)
      }*/     
    }

    useEffect(() => { 
      async function getInitialData(){
          await handleFetchIndicatorData(1)
      }
      getInitialData();
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const handleUpdateIndicator = async (muestras) => {
      //console.log("NEW REFRESH")
      //console.log(muestras)
      let res = await getIndicatorData(props.actualBoardId,props.indicator._id,muestras)
        if(res.ok) {
          let data = await res.json()
          //console.log(data)
          if (!!sensData && sensData.length>0 && sensData?.[sensData.length-1].fecha < data[0].fecha){
            let asd = sensData;
            asd?.splice(0, muestras);
            let newData = [
              ...asd,
              ...data,
            ]
            setData(newData)
          }
        }
    }

    useInterval(() => { //custom hook
      handleFetchIndicatorData(1)
    }, props.indicator.refreshRate*60*1000);
    
    return (

        <Grid item lg={3} md={6} sm={6} xs={12}>
        <Widget
          handleDeleteIndicator={handleDeleteIndicator}
          setHistoric={handleSetHistoric}
          title={props.indicator.name}
          upperTitle
          className={classes.card}
          bodyClass={classes.fullHeightBody}
        >
          <Grid container spacing={1} alignItems="center" direction="row" justifyContent="center">
          {!!sensData && props.indicator.sensors.map( sensor => MulipleIndicator(sensData,sensor.nombre,classes,theme,props.indicator))}
          </Grid>
        </Widget>
      </Grid>
    );
    }

    function MulipleIndicator(sensorsData,sensorName,classes,theme,indicator) {
      return  <Grid item xs={12}>
                <Typography
                  size="sx"
                  color="text"
                  colorBrightness="secondary"
                  className={classes.progressSectionTitle}
                >
                  {!!sensorsData[sensorsData.length-1][sensorName] ? `${sensorName}` : `-`}
                </Typography>
                <LinearProgressWithLabel
                  value={sensorsData[sensorsData.length-1][sensorName]}
                  classes={{ barColorPrimary: !!sensorsData[sensorsData.length-1][sensorName] ? handleProgressColor(classes,indicator,sensorsData[sensorsData.length-1][sensorName]): ""}}
                  className={classes.progress}
                />
              </Grid>
     }

     function LinearProgressWithLabel(props) {
      const [tooltip, setTooltip] = useState();
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Box sx={{ width: '100%', mr: 1 }}
            onMouseOver={() => setTooltip(true)}
            onMouseOut={() => setTooltip(false)}
          >
            {tooltip && <CustomTooltip/>}
            <LinearProgress variant="determinate" {...props} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">{`${Math.round(
              props.value,
            )}%`}</Typography>
          </Box>
        </Box>
      );
    }