import React, { useState, useEffect } from "react";
import {
  Grid,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
  Tooltip
} from "recharts";
// styles
import useStyles from "./styles";
import {getIndicatorData} from '../../api/Api'
import {handleLineColor} from "../../utils/utils"

// components

import Dot from "../Sidebar/components/Dot";
import Widget from "../Widget/Widget";
import { Typography } from "../Wrappers/Wrappers";

const mainChartData = getMainChartData();
const PieChartData = [
  { name: "Producto A", value: 400, color: "primary", fecha: "19:00"},
  { name: "Producto B", value: 300, color: "secondary", fecha: "19:00"},
  { name: "Producto C", value: 300, color: "warning", fecha: "19:00"},
  { name: "Producto D", value: 200, color: "success", fecha: "19:00"},
];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {/*payload.name*/}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      {/*<path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>*/}
    </g>
  );
};

export default function CircularGraphCustom(props) {
    var classes = useStyles();
    var theme = useTheme();
    const [activeIndex,setActiveIndex] = useState(0);

    const onPieEnter = (_,index) => {
      setActiveIndex(index)
    }

    const handleDeleteIndicator = () => {
      props.handleDeleteIndicator(props.indicator._id)
    }

    const handleSetHistoric = () => {
      props.setHistoricIndicator(props.indicator)
      props.setHistoric(true)
    }

    const handleFetchIndicatorData = async () => {
      let res = await getIndicatorData(props.atualBoardId,props.indicator._id,1)
      if (res.ok){
        let data = await res.json()
      }
    }

    useEffect(() => { 
      async function getInitialData(){
          await handleFetchIndicatorData()
      }
      //getInitialData();
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
    return (
    <Grid item lg={3} md={4} sm={6} xs={12}>
      <Widget 
        title={props.indicator.name}
        upperTitle 
        className={classes.card}
        setHistoric={handleSetHistoric}
        handleDeleteIndicator={handleDeleteIndicator}
        >
       <div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={400} height={400}>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={PieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={40}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                {PieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={handleLineColor(theme,props.indicator,PieChartData.value)}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
        </div>
      </Widget>

    </Grid>
    );
}


    function getRandomData(length, min, max, multiplier = 10, maxDiff = 10) {
        var array = new Array(length).fill();
        let lastValue;
      
        return array.map((item, index) => {
          let randomValue = Math.floor(Math.random() * multiplier + 1);
      
          while (
            randomValue <= min ||
            randomValue >= max ||
            (lastValue && randomValue - lastValue > maxDiff)
          ) {
            randomValue = Math.floor(Math.random() * multiplier + 1);
          }
      
          lastValue = randomValue;
      
          return { value: randomValue };
        });
      }
      

      function getMainChartData() {
        var resultArray = [];
        var tablet = getRandomData(31, 3500, 6500, 7500, 1000);
        var desktop = getRandomData(31, 1500, 7500, 7500, 1500);
        var mobile = getRandomData(31, 1500, 7500, 7500, 1500);
      
        for (let i = 0; i < tablet.length; i++) {
          resultArray.push({
            tablet: tablet[i].value,
            desktop: desktop[i].value,
            mobile: mobile[i].value,
          });
        }
      
        return resultArray;
      }