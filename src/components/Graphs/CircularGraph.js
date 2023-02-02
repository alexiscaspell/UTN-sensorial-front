import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Box
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";
// styles
import useStyles from "./styles";
import {getIndicatorData} from '../../api/Api'
import {formatData} from '../../utils/utils'
import { width, height } from '@material-ui/system';

// components

import Dot from "../Sidebar/components/Dot";
import Widget from "../Widget/Widget";
import { Typography } from "../Wrappers/Wrappers";
import {useInterval} from "../../utils/customhooks"
import {handleProgressColor,handleLineColor} from "../../utils/utils"
import {CustomTooltip} from "../CustomTooltip/CustomTooltip"


//const data = [{ "Taller 1": 70, "Taller 2": 80, "Taller 3": 30, fecha: "23:50:51", unidad: "porcentaje" }]

export default function CircularGraph(props) {
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
      if(!!res && res.ok) {
        let data = await res.json()
        //console.log(data)
        if (!!data && data.length > 0) {
          let sensNames = Object.entries(data[0])
          let result = sensNames.filter(entry => entry[0]!='fecha' && entry[0]!='unidad')
          let senNames = await result.map(entry => { return { fecha:data[0].fecha, color:`${handleLineColor(theme,props.indicator,entry[1])}`, unidad:"u/Hs", nombre: entry[0], valor: entry[1]}})
          setData(senNames)
        }
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
    
    useInterval( async() => { //custom hook
      handleFetchIndicatorData(1)
    }, isNaN(props.indicator.refreshRate) ? null : props.indicator.refreshRate*1000 );

    return (
    <Grid item lg={3} md={6} sm={6} xs={12}>
      <Widget 
        title={props.indicator.name}
        upperTitle 
        className={classes.card}
        setHistoric={handleSetHistoric}
        handleDeleteIndicator={handleDeleteIndicator}
        handleUpdateIndicator={props.handleUpdateIndicator}
        actualBoardId={props.actualBoardId}
        indicator={props.indicator}
        >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ResponsiveContainer width="100%" height={175}>
              <PieChart>
                <Pie
                  data={sensData}
                  innerRadius={0}
                  outerRadius={60}  
                  dataKey="valor">
                  {!!sensData && sensData.length > 0 && sensData.map((entry, index) => (
                    <Cell key={`index-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={<CustomTooltip/>}
                  isAnimationActive={true}
                />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={6}>
            <div className={classes.pieChartLegendWrapper}>
            {props.indicator.limitSuperior && <div key="1" className={classes.legendItemContainer}>
                  
                  <Typography style={{ whiteSpace: "nowrap", fontSize: 12 }} >
                    Limite superior:
                  </Typography>
                  <Typography color="text" colorBrightness="primary">
                    &nbsp;{props.indicator.limitSuperior}u/Hs&nbsp;
                  </Typography>
                  <Dot color="error" />
                </div>}
            <p></p>
            {props.indicator.limitInferior && <div key="2" className={classes.legendItemContainer}>
                  
                  <Typography style={{ whiteSpace: "nowrap", fontSize: 12 }} >
                    Limite inferior:
                  </Typography>
                  <Typography color="text" colorBrightness="primary">
                    &nbsp;{props.indicator.limitInferior}u/Hs&nbsp;
                  </Typography>
                  <Dot color="error" />
                </div>}
            </div>
          </Grid>

        </Grid>
      </Widget>
    </Grid>
    );
}

