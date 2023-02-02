import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/styles';
import {saveUser} from '../../../../api/Api'
import { 
    Button, 
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    MenuItem
} from "@material-ui/core";
import { parseDate } from "../../../../utils/utils";

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

const currencies = [
  {
    value: 'admin',
    label: 'Admin',
  },
  {
    value: 'user',
    label: 'User',
  },

];

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [nombre, setNombre] = React.useState();
  const [mail, setMail] = React.useState();
  const [password, setPassword] = React.useState();
  const [repassword, setRePassword] = React.useState();
  const [errorvalidate, setValidate] = React.useState(false);
  const [rol, setRol] = React.useState();
  const [disable, setDisabled] = React.useState(true);

  const handleNameChange = function(e) {
    setNombre(e.target.value);
  }

  const handleMailChange = function(e) {
    setMail(e.target.value);
  }

  const handlePassChange = function(e) {
    setPassword(e.target.value);
  }

  const handleRepassChange = function(e) {
    setRePassword(e.target.value);
  }

  const handleValidatePass = function() {
    setValidate(password!==repassword)
  }

  const handleRolChange = function(e) {
    setRol(e.target.value);
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setDisabled(true);
    setNombre("");
    setMail("");
    setPassword("");
    setRePassword("");
    setValidate(false)
    setRol("")
    setOpen(false);
  };

  const handleCreate = async () => {
    let newUser = {
      mail: mail,
      nombre: nombre,
      rol: rol,
      password: password,
      //fecha_creacion: Date.now(),
      //ultimo_login: Date.now(),
    }

    let res = await saveUser(newUser)
    if (res.ok){
      props.handleNewNotification("Usuario creado exitosamente","success")

      let newUser = await res.json()
      let userArr = [];
      let localUser = props.userList;
      userArr[0] = newUser.mail.toLowerCase();
      userArr[1] = newUser.nombre;
      userArr[2] = newUser.rol;
      userArr[3] = parseDate(newUser.fecha_creacion);
      userArr[4] = parseDate(newUser.ultimo_login);
      userArr[5] = newUser._id;

      localUser.push(userArr)
      props.setUserList([])
      props.setUserList(localUser)
      
    } else if (res.status == 409) {
      props.handleNewNotification("Ya existe usuario registrado con el mismo mail","warning")

    } else {
      props.handleNewNotification("Error al crear el usuario usuario","error")
    }
    handleClose()

  };

  const handleDisable = () => {
    if (!errorvalidate && !!nombre && !!mail && !!password && !!repassword && !!rol){
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }

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
  },[mail,nombre,password,repassword,rol]);

  useEffect(() => { //tiene que haber un useEffect por cada variable de estado de chart a modificar
    async function validatepass(){
      await handleValidatePass()
    }
    validatepass();

  },[password,repassword]);

  return (

    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Agregar usuario
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Nuevo usuario</DialogTitle>
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
            id="mail"
            label="Mail"
            type="mail"
            fullWidth
            onChange={handleMailChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            fullWidth
            onChange={handlePassChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="outlined-password-input"
            label="Confirm Password"
            type="password"
            autoComplete="current-password"
            fullWidth
            error={errorvalidate}
            onChange={handleRepassChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="outlined-tel"
            label="Télefono"
            type="number"
            fullWidth
          />
          <TextField
            id="outlined-select"
            margin="dense"
            select
            label="Rol"
            value={rol}
            fullWidth
            onChange={handleRolChange}
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
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