import React, { useState, useEffect } from "react";
import {
  Grid,
  Select,
  OutlinedInput,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  TextField
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import CloseIcon from '@material-ui/icons/Close';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  YAxis,
  XAxis,
  ReferenceLine,
  Tooltip
} from "recharts";
// styles
import useStyles from "./styles";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {handleLineColor} from "../../utils/utils"

// components
import Dot from "../Sidebar/components/Dot";
import InputSlider from "../Slider/Slider";
import { withStyles } from '@material-ui/core/styles';
import {getIndicatorHistoricData} from '../../api/Api';


import Widget from "../Widget/Widget";
import { Typography } from "../Wrappers/Wrappers";
import SimpleModal  from "../Filtros/Filtros"

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
          <Box display="flex" justifyContent="center" m={0} p={0} >
            <Box p={1}>
              <Typography variant="h3" gutterBottom>
                {children}
              </Typography>
            </Box>
          </Box>

          {onClose ? (
              <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                <CloseIcon />
              </IconButton>
            ) : null}
    </MuiDialogTitle>
  );
});


   



export default function HistoricalChart(props) {
    var classes = useStyles();
    var theme = useTheme();
    var date = new Date(Date.now())
    // local

    const [sensData, setData] = useState();
    const [filtros, setFiltros] = useState();
    const [lastSearch, setLastSearch] = useState({});

    const handleClose = function(e) {
      props.setHistoric(false);
    }

    const handleRefresh = async function(startDate, endDate, granularity, unit) {
      let res = await getIndicatorHistoricData(props.actualBoardId, props.historicIndicator._id, startDate, endDate, granularity, unit)
        if(res.ok) {
          let data = await res.json()
          setData(data)
          setLastSearch({
            startDate: startDate,
            endDate: endDate,
            granularity: granularity,
            unit: unit,
          })
          handleFiltrosClose()
        }

    }
  
    const handleFiltrosOpen = async function() {
      setFiltros(true)
    }
  
      
    const handleFiltrosClose = async function() {
      setFiltros(false)
    }
  

    useEffect(() => { 
      async function getInitialData(){
        var now = new Date();
        handleRefresh(new Date(), now, 50, "hora")
      }
      getInitialData();
    },[]);

    return (
    <Dialog open={props.isOpen} onClose={handleClose} aria-labelledby="form-dialog-title"
      fullWidth={true}
      maxWidth="lg"
      >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid item>
          <DialogTitle onClose={handleClose} id="form-dialog-title">
            Grafico históricos de {props.historicIndicator.name}
          </DialogTitle>
        </Grid>

      <DialogContent>
        <Widget
          bodyClass={classes.mainChartBody}
          header={
            <div className={classes.mainChartHeader}>
              <Grid container
                spacing={0}
                alignItems="center"
                justifyContent="flex-end"
                > 
                <Grid item>
                  <Button handleRefresh={handleRefresh} onClick={handleFiltrosOpen} variant="outlined" color="primary">
                    Filtros
                  </Button>
                  </Grid>       
                <Grid item>
                </Grid>
              </Grid>
            </div>
          }
        >

          <ResponsiveContainer width="100%" minWidth={1185} height={350}>
            <LineChart
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              data={sensData}
            >

              <YAxis />
              <XAxis hide={false} dataKey="fecha" />
              <Tooltip isAnimationActive={false}/>
              {!!sensData && props.historicIndicator.sensors.map( sensor => { return MultipleLines(props.historicIndicator,sensor.nombre,sensData,theme)} )}

              {!!props.historicIndicator.limitSuperior && <ReferenceLine y={props.historicIndicator.limitSuperior} label={`${props.historicIndicator.limitSuperior}`} stroke="red" strokeDasharray="3 3"/>}
              {!!props.historicIndicator.limitInferior && <ReferenceLine y={props.historicIndicator.limitInferior} label={`${props.historicIndicator.limitInferior}`} stroke="red" strokeDasharray="3 3"/>}

            </LineChart>
          </ResponsiveContainer>  
        </Widget>


      </DialogContent>

      </Grid>
      {
        filtros && <SimpleModal 
          isOpen={filtros}
          lastSearch={lastSearch}
          handleRefresh={handleRefresh}
          handleClose={handleFiltrosClose} 
        />
      }
    </Dialog>

    
    );
}

  function MultipleLines(indicator,sensorName,sensData,theme) {
    return <Line
      type="monotone"      
      dataKey={sensorName}
      //stroke={handleLineColor(theme,indicator,valores[valores.length-1]?.valor)}
      strokeWidth={3}
      dot={false}
    />
   }

