import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import {
  LineChart,
  Line,
  Tooltip,
  XAxis,
  ReferenceLine
} from "recharts";
// styles
import useStyles from "./styles";
import {getIndicatorData} from '../../api/Api'
import {handleLineColor, getUnit} from "../../utils/utils"
import {useInterval} from "../../utils/customhooks"

// components
import {CustomTooltip} from "../CustomTooltip/CustomTooltip"

import Widget from "../Widget/Widget";
import { Typography } from "../Wrappers/Wrappers";

export default function VariationChar(props) {
    var classes = useStyles();
    var theme = useTheme();
    var [sensData, setData] = useState();
    
    const handleDeleteIndicator = () => {
        props.handleDeleteIndicator(props.indicator._id)
    }

    const handleSetHistoric = () => {
        props.setHistoricIndicator(props.indicator)
        props.setHistoric(true)
    }

    const handleFetchIndicatorData = async (muestras) => {
      let res = await getIndicatorData(props.actualBoardId,props.indicator._id,muestras)
        if (res.ok){
          let data = await res.json()
          //console.log(data)
          setData(data)
        }    
    }

    const handleRefreshIndicator = async (muestras) => {
      //console.log("NEW REFRESH")
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
        //console.log("entra en el update")
        let asd = indData;
        asd.splice(0, muestras);

        return [
          ...asd,
          ...newData,
        ]
      } else {
        //console.log("no entra en el update")

        return indData
      }
    }

    useEffect( () => { 
        async function getInitialData(){
            handleFetchIndicatorData(8)
        }
        getInitialData()
      },[]);

    useInterval(() => { //custom hook
        handleRefreshIndicator(1)
      }, isNaN(props.indicator.refreshRate) ? null : props.indicator.refreshRate*1000 );

    return (

    <Grid item lg={3} md={6} sm={6} xs={12}>
            <Widget
                title={props.indicator.name}
                upperTitle
                bodyClass={classes.fullHeightBody}
                className={classes.card}
                setHistoric={handleSetHistoric}
                handleDeleteIndicator={handleDeleteIndicator}
                handleUpdateIndicator={props.handleUpdateIndicator}
                actualBoardId={props.actualBoardId}
                indicator={props.indicator}
            >
                <div className={classes.visitsNumberContainer} >
                <Grid container item alignItems={"center"}>
                    <Grid item xs={6}>
                <Typography size="xl" weight="medium" noWrap>
                    {(!!sensData && sensData.length>0) && `${sensData[sensData.length-1][props.indicator.sensors[0].nombre]} ${getUnit(props.indicator.type)}`}
                </Typography>
                    </Grid>
                    <Grid item xs={6}>
                  {!!sensData && <LineChart
                    width={140}
                    height={100}
                    data={sensData}
                  >
                  <Line
                      type="monotone"
                      dataKey={props.indicator.sensors[0].nombre}
                      stroke={(!!sensData && sensData.length>0) && handleLineColor(theme,props.indicator,sensData[sensData.length-1][props.indicator.sensors[0].nombre])}
                      strokeWidth={3}
                      dot={false}
                    />
                    <XAxis hide={true} dataKey="fecha" />
                    <Tooltip/>
                    {!!props.indicator.limitSuperior && <ReferenceLine y={props.indicator.limitSuperior} label={`${props.indicator.limitSuperior}`} stroke="red" strokeDasharray="3 3"/>}
                    {!!props.indicator.limitInferior && <ReferenceLine y={props.indicator.limitInferior} label={`${props.indicator.limitInferior}`} stroke="red" strokeDasharray="3 3"/>}
                </LineChart>}
                    </Grid>
                </Grid>
                </div>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                  <Grid item xs={4}>
                      <Typography color="text" colorBrightness="secondary" noWrap>
                        Variacion 
                      </Typography>
                      <Typography size="md">
                          {(!!sensData && sensData.length>1) ? `${(sensData[sensData.length-1][props.indicator.sensors[0].nombre]-sensData[sensData.length-2][props.indicator.sensors[0].nombre]).toFixed(1)} ${getUnit(props.indicator.type)}`: "-"}              
                      </Typography>
                  </Grid>
                  <Grid item xs={4}>
                      <Typography color="text" colorBrightness="secondary" noWrap>
                      
                      </Typography>
                      <Typography size="md"></Typography>
                  </Grid>
                  <Grid item xs={4}>
                      <Typography color="text" colorBrightness="secondary" noWrap>
                        Ratio
                      </Typography>
                      <Typography size="md">
                        {(!!sensData && sensData.length>1) ?  `${((sensData[sensData.length-1][props.indicator.sensors[0].nombre]-sensData[sensData.length-2][props.indicator.sensors[0].nombre]).toFixed(1)*100/sensData[sensData.length-1][props.indicator.sensors[0].nombre]).toFixed(1)}%` : "-"}              
                      </Typography>
                  </Grid>
                </Grid>
            </Widget>
            </Grid>
    );
    }
