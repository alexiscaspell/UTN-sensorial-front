import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/styles';
import Modal from '@material-ui/core/Modal';
import { 
    Button, 
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    MenuItem,
    Grid,
    InputAdornment,
    Select,
    OutlinedInput,
    Box,
    IconButton,
} from "@material-ui/core";
import clsx from 'clsx';
import {formatHistoricDates} from "../../utils/utils"
import InputSlider from "../Slider/Slider";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(0),
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(2),
      width: 200,
    },
  })
);

const unidades = [
    {
      value: 'hora',
      label: 'Hora',
    },
    {
      value: 'dia',
      label: 'Día',
    },
    {
      value: 'semana',
      label: 'Semana',
    },
    {
      value: 'mes',
      label: 'Mes',
    },
    {
        value: 'año',
        label: 'Año',
      },
  ];


export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  let lastSearch = props.lastSearch
  const [disable, setDisabled] = React.useState(true);
  const [unit, setUnit] = useState(lastSearch?.unit ?? "hora");
  const [startDate, setStartDate] = React.useState(lastSearch?.startDate ?? formatHistoricDates(1));
  const [endDate, setEndDate] = React.useState(lastSearch?.endDate ?? formatHistoricDates(0));
  const [granularity, setGranularity] = React.useState(lastSearch?.granularity ?? 50);



  const handleDisable = () => {
    let strDate = startDate ?? ""
    let endDt = endDate ?? "1"
    if (endDt>=strDate && !!granularity && !!unit){
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }

  const handleRefresh = async function() {
      props.handleRefresh(startDate, endDate, granularity, unit)
  }


  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };    
  
  const handleGranularity = (e) => {
    if (e.target.value>100){
        setGranularity(100);
      } else if (e.target.value<1) {
        setGranularity(0);
      } else {
        setGranularity(e.target.value);
      }
  };
  
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleUnidad = (e) => {
    setUnit(e.target.value);
  };

  useEffect(() => { //tiene que haber un useEffect por cada variable de estado de chart a modificar
    async function disable(){
      await handleDisable()
    }
    disable();

  },[unit,endDate,startDate,granularity]);

  return (
        <Dialog 
            open={props.isOpen} 
            onClose={props.handleClose} 
            aria-labelledby="form-dialog-title"
            maxWidth='lg'
        >
            
        <DialogTitle id="form-dialog-title"></DialogTitle>
        <DialogContent>
                <TextField
                id="datetime-localinit"
                label="Fecha inicial"
                type="datetime-local"
                defaultValue={startDate}
                format="dd/MM/yyyy"
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={handleStartDateChange}
                />
                <TextField
                id="datetime-localend"
                label="Fecha final"
                type="datetime-local"
                defaultValue={endDate}
                format="dd/MM/yyyy"
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={handleEndDateChange}
                /> 
                &nbsp;&nbsp;&nbsp;
                <TextField
                    label="Granularidad"
                    id="standard-start-adornment"
                    type="number"
                    value={granularity}
                    className={classes.textField}
                    InputProps={{
                    inputProps: { min: 0, max: 100 },
                    startAdornment: <InputAdornment position="start">%</InputAdornment>,
                    }}
                    onChange={handleGranularity}
                />
                &nbsp;&nbsp;&nbsp;
                <TextField
                    id="outlined-select-currency"
                    select
                    label="Unidad"
                    value={unit}
                    className={classes.textField}

                    onChange={handleUnidad}
                    >
                    {unidades.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>          
        </DialogContent>
        
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRefresh} color="primary" disabled={disable}>
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
  );
}