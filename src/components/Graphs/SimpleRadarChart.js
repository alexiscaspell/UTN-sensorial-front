import React, { useState, useEffect } from "react";
import { 
  Radar,
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import Widget from "../Widget/Widget";
import {
  Grid,
  LinearProgress,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import useStyles from "./styles";
import {getIndicatorData} from '../../api/Api'

const mockData = [
  {
    "id_sensor": "611b57e1113636bf060a9c2c",
    "unidad": "porcentaje",
    "valores": [
      {
        "fecha": "2021-08-17T07:07:01.607000Z",
        "valor": 8.1
      }
    ]
  },
  {
    "id_sensor": "611b57e1113636bf060a9c2d",
    "unidad": "porcentaje",
    "valores": [
      {
        "fecha": "2021-08-17T07:02:01.607000Z",
        "valor": 8.5
      }
    ]
  },
  {
    "id_sensor": "6138248f2b7c83edbac83e75",
    "unidad": "porcentaje",
    "valores": [
      {
        "fecha": "2021-08-17T06:57:01.607000Z",
        "valor": 9.1
      }
    ]
  }
]

const data = [
  {
    subject: 'Math',
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: 'Chinese',
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'English',
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'Geography',
    A: 198,
    B: 190,
    fullMark: 150,
  },
  {
    subject: 'Physics',
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: 'History',
    A: 65,
    B: 85,
    fullMark: 150,
  },
];

export default function SimpleRadarChart(props) {
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
    let res = await getIndicatorData(props.atualBoardId,props.indicator._id,muestras)
    //console.log(res)
      if (res.ok){

        let data = await res.json()
        //console.log(data)
        setData(data)
      }    
  }

  useEffect(() => { 
    async function getInitialData(){
        await handleFetchIndicatorData(5)
    }
    getInitialData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return <Grid item lg={3} md={6} sm={6} xs={12}>
        <Widget
          handleDeleteIndicator={handleDeleteIndicator}
          setHistoric={handleSetHistoric}
          title={props.indicator.name}
          upperTitle
          className={classes.card}
          bodyClass={classes.fullHeightBody}
        >

        <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="id_sensor" />
              <PolarRadiusAxis orientation="left"/>
              <Radar label={true} name="prod/Hs" dataKey="valores[0].valor" fill={theme.palette.error.main} fillOpacity={1} />
              <Tooltip isAnimationActive={false}/>
            </RadarChart>
          </ResponsiveContainer>
          </Widget>
      </Grid>

}

const CustomTooltip = ({ active, payload, label }) => {
  var classes = useStyles();

  if (active && payload && payload.length) {
    return (
      <div className={classes.widgetWrapper}>
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};
