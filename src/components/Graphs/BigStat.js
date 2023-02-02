import React, { useState, useEffect } from "react";
import {
  Grid,
  Select,
  OutlinedInput,
  MenuItem,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  PieChart,
  Pie,
  Cell,
  YAxis,
  XAxis,
} from "recharts";
// styles
import useStyles from "./styles";

// components
import mock from "./mock.js";
import Dot from "../Sidebar/components/Dot";
import Table from "../Table/Table"


import Widget from "../Widget/Widget";
import { Typography } from "../Wrappers/Wrappers";

const mainChartData = getMainChartData();
const PieChartData = [
  { name: "Producto A", value: 400, color: "primary" },
  { name: "Producto B", value: 300, color: "secondary" },
  { name: "Producto C", value: 300, color: "warning" },
  { name: "Producto D", value: 200, color: "success" },
];


export default function BigStat(props) {
    var classes = useStyles();
    var theme = useTheme();
        //var { isAdmin } = useUserState();
      
        // local
    var [mainChartState, setMainChartState] = useState("monthly");

    return (
        mock.bigStat.map(stat => (
            <Grid item md={4} sm={6} xs={12} key={stat.product}>
              <BigStat {...stat} />
            </Grid>
          ))
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


