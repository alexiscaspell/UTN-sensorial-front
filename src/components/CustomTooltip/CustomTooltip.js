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
import { Typography } from "../Wrappers/Wrappers";


const CustomTooltip = ({ active, payload, label }) => {

    const classes = useStyles()

    if (active && payload && payload.length) {
      return (
        <div className={classes.widgetWrapper}>
          <Paper variant="outlined" elevation={1}  className={classes.paper} >
            <Box sx={{ m: 1 }}>
              <Grid container
                direction="column"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={1}
              >
                <Grid item>
                  <Typography color="textPrimary" noWrap>
                    {`${payload[0].payload.fecha}`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography color="textPrimary" style={{color:payload[0].payload.color, fontSize: 14 }} noWrap>
                    {`${payload[0].payload.nombre} : ${payload[0].payload.valor}${getUnit(payload[0].payload.unidad)}`}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </div>
      );
    }
  
    return null;
  };

  const getUnit = (unidad) => {
    if (!unidad)
      return "ºC"
    return unidad
  } 
  

  export {CustomTooltip}