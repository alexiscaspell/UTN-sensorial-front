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
} from "@material-ui/core";
import {saveObjetivo, deleteObjetivo} from '../../../../api/Api';
import clsx from 'clsx';

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


export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [disable, setDisabled] = React.useState(true);
  const [nombre, setNombre] = React.useState();
  const [description, setDescription] = React.useState();
  const [objValue, setObjValue] = React.useState(0);
  const [indicadorInd, setIndicadorInd] = React.useState();
  const [startDate, setStartDate] = React.useState();
  const [endDate, setEndDate] = React.useState();
  const [endTime, setEndTime] = React.useState();
  const [startTime, setStartTime] = React.useState();

  /*async function fetchDashboardData() {
    try {
      const res = await getDashboardData(props.actualBoardId)
      if (!!res && res.ok) {
        const data = await res.json()
        console.log(data)
        setActualBoardObjetives(data.objetives)
        setActualBoardIndicators(data.indicators)
      }
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => { 
    async function getInitialData(){
      fetchDashboardData()
    }
    getInitialData();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);*/

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleNameChange = function(e) {
    setNombre(e.target.value);
  }

  const handleDescChange = function(e) {
    setDescription(e.target.value);
  }

  const handleChangeObjetive = function(e) {
    console.log(e.target.value)
    setIndicadorInd(e.target.value);
  }

  const handleObjetiveValue = function(e) {
    if (e.target.value>100){
      setObjValue(100)
    } else if (e.target.value<1) {
      setObjValue(0)
    } else {
      setObjValue(e.target.value);
    }
  }

  const handleDisable = () => {
    /*let endDat = new Date(`${endDate}T${endTime}`)*/
    let strDate = startDate ?? new Date()
    let endDat = endDate
    if(!!endDate) 
      endDat = new Date(endDate)
    if(!!strDate) 
      strDate = new Date(strDate)
  
    console.log("Fecha final")
    console.log(endDat)

    console.log("Fecha inicial")
    console.log(strDate)
    //console.log(strDate)
    if (/*props.actualBoardInd.length>0*/ indicadorInd>=0 && !!nombre && !!description && objValue>0 && !!endDat && endDat>strDate){
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }

  const handleClose = () => {
    setDescription("")
    setNombre("")
    setObjValue(0)
    setStartDate("")
    setStartTime("")
    setEndDate("")
    setEndTime("")
    setIndicadorInd(null)
    props.handleClose()  
  };

  const handleCreate = async () => {
  //startDate: (!!startDate && !!startTime ) ? new Date(`${startDate}T${startTime}`) : new Date(Date.now()),

    props.handleCreateObjetive(nombre, description, objValue, startDate, endDate, props.actualBoardInd[indicadorInd].name, props.actualBoardInd[indicadorInd]._id)
    handleClose() 
  };

  useEffect(() => { //tiene que haber un useEffect por cada variable de estado de chart a modificar
    async function getInitialDashs(){
      await getModalStyle()
    }
    getInitialDashs();
  },[]);

  useEffect(() => { //tiene que haber un useEffect por cada variable de estado de chart a modificar
    async function disable(){
      handleDisable()
    }
    disable();

  },[description,nombre,objValue,endDate,startDate,endTime,startTime]);

  return (

    <div>
      <Dialog open={props.isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Nuevo objetivo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ****
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nombre"
            type="name"
            fullWidth
            onChange={handleNameChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Descripción"
            type="description"
            fullWidth
            onChange={handleDescChange}
          />
          <TextField
            autoFocus
            margin="dense"
            select
            label="Indicador"
            value={indicadorInd}
            fullWidth
            onChange={handleChangeObjetive}
          >
            {
              props.actualBoardInd.map((obj, index) => (
                <MenuItem key={obj._id} value={index}>
                  {obj.name}
                </MenuItem>
              ))
            }
          </TextField>
          <TextField
            id="datetime-localinit"
            label="Fecha inicial"
            type="datetime-local"
            defaultValue=""
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
          defaultValue=""
          format="dd/MM/yyyy"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleEndDateChange}
        />
          <TextField
            label="Valor del objetivo"
            id="standard-start-adornment"
            type="number"
            value={objValue}
            defaultValue={100}
            className={clsx(classes.margin, classes.textField)}
            InputProps={{
              inputProps: { min: 0, max: 100 },
              startAdornment: <InputAdornment position="start">%</InputAdornment>,
            }}
            onChange={handleObjetiveValue}
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary" disabled={disable}>
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}