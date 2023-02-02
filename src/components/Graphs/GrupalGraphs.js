import React, { useState, useEffect } from "react";
import {
  Grid,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    LineChart,
    Line,
    Tooltip,
    XAxis,
    ReferenceLine,
    CartesianGrid,
} from "recharts";
import useStyles from "./styles";
import {handleLineColor} from "../../utils/utils"
import {useInterval} from "../../utils/customhooks"

// components

import Widget from "../Widget/Widget";
import { Typography } from "../Wrappers/Wrappers";
import { LocalPrintshopSharp } from "@material-ui/icons";
import {getIndicatorData} from '../../api/Api'


export default function BarrasChar(props) {
    var classes = useStyles();
    var theme = useTheme();
    var [sensData, setData] = useState();

        //var { isAdmin } = useUserState();
    
      const handleDeleteIndicator = () => {
        props.handleDeleteIndicator(props.indicator._id)
      }
  
      const handleSetHistoric = () => {
        props.setHistoricIndicator(props.indicator)
        props.setHistoric(true)
      }

    const handleFetchIndicatorData = async () => {
      let res = await getIndicatorData(props.actualBoardId,props.indicator._id,8)
      if(!!res && res.ok) {
          let data = await res.json()
          //console.log(data)
          setData(data)
        }    
    }

    useEffect(() => { 
      async function getInitialData(){
          await handleFetchIndicatorData()
      }
      getInitialData();
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const handleUpdateIndicator = async (muestras) => {
      let res = await getIndicatorData(props.actualBoardId,props.indicator._id,muestras)
        if(!!res && res.ok) {
          let data = await res.json()
          //console.log(data)
          if (!!data && data.length>0){
            setData(indData => handleUpdateState(indData, data,muestras))
          }
        } 
        /*if (!!res && res?.status == 409) {
          props.handleUpdateDeletedIndicator(props.indicator._id)
        }*/
    }

    const handleUpdateState = (indData,newData,muestras) => {
      if (indData?.[indData.length-1].fecha < newData[0].fecha) {
        let asd = indData;
        asd.splice(0, muestras);
        return [
          ...asd,
          ...newData,
        ]
      } else {
        return indData
      }
    }

    useInterval(async() => { //custom hook
      handleUpdateIndicator(1)
    }, isNaN(props.indicator.refreshRate) ? null : props.indicator.refreshRate*1000 );

    return (

        <Grid item lg={3} md={6} sm={6} xs={12}>
          <Widget
            title={props.indicator.name}
            upperTitle
            className={classes.card}
            bodyClass={classes.fullHeightBody}
            setHistoric={handleSetHistoric}
            handleDeleteIndicator={handleDeleteIndicator}
            handleUpdateIndicator={props.handleUpdateIndicator}
            actualBoardId={props.actualBoardId}
            indicator={props.indicator}
          >
            {!!sensData && sensData.length > 0 && props.indicator.sensors.map( sensor => MulipleIndicator(sensData,sensor.nombre,classes,theme,props.indicator))}
          </Widget>
        </Grid>
    );

}

    function MulipleIndicator(sensorsData,sensorName,classes,theme,indicator) {
     return  <div className={classes.serverOverviewElement}>
              <Typography
                color="text"
                colorBrightness="secondary"
                className={classes.serverOverviewElementText}
                noWrap
              >
                {sensorName} 
              </Typography>
              <div className={classes.serverOverviewElementChartWrapper}>
                <ResponsiveContainer height={60} width="85%">
                <LineChart 
                  data={sensorsData}
                  margin={{
                    top: 10,
                    right: 5,
                    left: 0,
                    bottom: 10,
                  }}
                >
                    <Line
                      type="monotone"
                      dataKey={sensorName}
                      stroke={handleLineColor(theme,indicator,sensorsData[sensorsData.length-1][sensorName])}
                      strokeWidth={3}
                      dot={false}
                    />
                    <XAxis hide={true} dataKey="fecha" />
                    <Tooltip isAnimationActive={true}/>

                    {!!indicator.limitSuperior && <ReferenceLine y={indicator.limitSuperior} label={`${indicator.limitSuperior}`} stroke="red" strokeDasharray="3 3"/>}
                    {!!indicator.limitInferior && <ReferenceLine y={indicator.limitInferior} label={`${indicator.limitInferior}`} stroke="red" strokeDasharray="3 3"/>}
 
                  </LineChart>

                </ResponsiveContainer>
              </div>
            </div>

    }