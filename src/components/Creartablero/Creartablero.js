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
    DialogContentText
} from "@material-ui/core";
import {saveDashboard} from '../../api/Api'
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
  })
);


export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [nombre, setNombre] = React.useState();
  const [description, setDescription] = React.useState();
  const [disable, setDisabled] = React.useState(true);

  const handleNameChange = function(e) {
    setNombre(e.target.value);
  }

  const handleDescChange = function(e) {
    setDescription(e.target.value);
  }

  const handleDisable = () => {
    if (!!nombre && !!description){
        setDisabled(false)
    } else {
      setDisabled(true)
    }
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setDescription("")
    setNombre("")
    setOpen(false);
  };

  const handleCreate = async () => {
    let newUser = {
      nombre: nombre,
      descripcion: description,
    }
  
    let res = await saveDashboard(newUser)
    if (res.ok){
      let newDash = await res.json()
      props.setDashIds([newDash._id])
      props.setActualBoard(newDash._id)
      props.setDashboardList([newDash.nombre])
      
      handleClose()
    }
  
  };

  useEffect(() => { //tiene que haber un useEffect por cada variable de estado de chart a modificar
    async function getInitialDashs(){
      await getModalStyle()
    }
    getInitialDashs();

  },[]);

  useEffect(() => { //tiene que haber un useEffect por cada variable de estado de chart a modificar
    async function disable(){
      await handleDisable()
    }
    disable();

  },[description,nombre]);

  return (

    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Agregar tablero
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Nuevo tablero</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ****
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            placeholder="Nombre"
            type="name"
            fullWidth
            onChange={handleNameChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            placeholder="Descripción"
            type="description"
            fullWidth
            onChange={handleDescChange}
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