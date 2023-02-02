import React, { useState, useEffect } from "react";
import {
  Grid,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';

// styles
import useStyles from "./styles";
import {getIndicatorData} from '../../api/Api'
import {formatData} from '../../utils/utils'

// components
import {CustomTooltip} from "../CustomTooltip/CustomTooltip"
import Dot from "../Sidebar/components/Dot";
import Widget from "../Widget/Widget";
import { Typography } from "../Wrappers/Wrappers";
import {handleProgressColor,handleLineColor} from "../../utils/utils"
import {useInterval} from "../../utils/customhooks"

const data = [
  {
    name: 'Page A',
    uv: 590,
    pv: 800,
    amt: 1400,
  },
  {
    name: 'Page B',
    uv: 868,
    pv: 967,
    amt: 1506,
  },
  {
    name: 'Page C',
    uv: 1397,
    pv: 1098,
    amt: 989,
  },
  {
    name: 'Page D',
    uv: 1480,
    pv: 1200,
    amt: 1228,
  },
  {
    name: 'Page E',
    uv: 1520,
    pv: 1108,
    amt: 1100,
  },
  {
    name: 'Page F',
    uv: 1400,
    pv: 680,
    amt: 1700,
  },
];

export default function VerticalBar(props) {
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
        if(!!data && data.length>0){
          let sensNames = Object.entries(data[0])
          let result = sensNames.filter(entry => entry[0]!='fecha' && entry[0]!='unidad')
          let senNames = await result.map(entry => { return { fecha:data[0].fecha, color:`${handleLineColor(theme,props.indicator,entry[1])}`, unidad:"PPM", nombre: entry[0], valor: entry[1]}})
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

    useInterval(async () => { //custom hook
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
        <ResponsiveContainer width="100%" height={175}>
        <BarChart
              layout="horizontal"
              width={300}
              height={175}
              data={sensData}
              margin={{
                top: 5,
                right: 15,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis hide={false} dataKey="nombre" />
              <YAxis hide={false} type="number" />
              <Tooltip 
                isAnimationActive={false}
                content={<CustomTooltip/>}
              />
              {!!sensData && sensData.length > 0 && <Bar barSize={40} dataKey="valor" fill="" >
                {sensData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>}
              {!!props.indicator.limitSuperior && <ReferenceLine y={props.indicator.limitSuperior} label={`${props.indicator.limitSuperior}`} stroke="red" strokeDasharray="3 3"/>}
              {!!props.indicator.limitInferior && <ReferenceLine y={props.indicator.limitInferior} label={`${props.indicator.limitInferior}`} stroke="red" strokeDasharray="3 3"/>}
        </BarChart>
        </ResponsiveContainer>

      </Widget>
    </Grid>
    );
}