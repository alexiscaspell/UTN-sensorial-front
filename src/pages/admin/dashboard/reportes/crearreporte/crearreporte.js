import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from '@material-ui/styles';
import {saveReport, getAllUsersData} from '../../../../../api/Api'
import Chip from '@material-ui/core/Chip';

import { 
    Button, 
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Input,
    
} from "@material-ui/core";

const ITEM_HEIGHT = 32;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}


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
    formControl: {
      marginLeft: theme.spacing(0),
      marginRight: theme.spacing(0),
      marginTop: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(0),
      marginTop: theme.spacing(1),
      width: 200,
      minWidth: 120,
      maxWidth: 300,
    },
  })
);

const days = [
  {
    value: 'Lunes',
    label: 'Lunes',
  },
  {
    value: 'Martes',
    label: 'Martes',
  },
  {
    value: 'Miércoles',
    label: 'Miércoles',
  },
  {
    value: 'Jueves',
    label: 'Jueves',
  },
  {
    value: 'Viernes',
    label: 'Viernes',
  },
  {
    value: 'Sábado',
    label: 'Sábado',
  },
  {
    value: 'Domingo',
    label: 'Domingo',
  }]


export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [nombre, setNombre] = React.useState();
  const [descripcion, setDescriptcion] = React.useState();
  const [destinatarios, setDestinatarios] = React.useState([]);
  const [dia, setDia] = React.useState();
  const [horario, setHorario] = React.useState();
  const [disable, setDisabled] = React.useState(true);

  const theme = useTheme();

  const handleChange = (e) => {
    setDestinatarios(e.target.value);
  };

  const handleNameChange = function(e) {
    setNombre(e.target.value);
  }

  const handleDescriptionChange = function(e) {
    setDescriptcion(e.target.value);
  }


  const handleHoraChange = function(e) {
    setHorario(e.target.value);
  }

  const handleDiaChange = function(e) {
    setDia(e.target.value);
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setDisabled(true);
    setNombre("");
    setDescriptcion("");
    setDestinatarios([]);
    setDia("");
    setHorario("");
    setOpen(false);
  };

  const handleCreate = async () => {
    let newReport = {
      nombre: nombre,
      descripcion: descripcion,
      destinatarios: destinatarios,
      dia: dia,
      horario: horario
    }

    let res = await saveReport(props.dashboardId,newReport)
    console.log(res)
    if (!!res && res.ok){
      props.handleNewNotification("Reporte creado exitosamente","success")
      let newUser = await res.json()
      console.log(newUser)
      let userArr = [];
      let localReport = props.reportList;
      userArr[0] = newUser.nombre;
      userArr[1] = newUser.descripcion;
      userArr[2] = newUser.destinatarios.join(', ');
      userArr[3] = newUser.dia;
      userArr[4] = newUser.horario;
      userArr[5] = newUser.id;
      localReport.push(userArr)
      props.setReportsData([])
      props.setReportsData(localReport)
     
    } else {
      props.handleNewNotification("No se pudo crear el reporte","error")
    }
    handleClose()
  };

  const handleDisable = () => {
    if (!!nombre && !!descripcion && !!dia && !!horario && destinatarios.length>0){
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
  },[destinatarios,nombre,descripcion,dia,horario]);


  return (

    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Agregar reporte
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Nuevo reporte</DialogTitle>
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
            id="descripcion"
            label="Descripcion"
            fullWidth
            onChange={handleDescriptionChange}
          />
          <TextField
            id="outlined-select"
            margin="dense"
            select
            label="Día"
            value={dia}
            fullWidth
            onChange={handleDiaChange}
          >
            {
              days.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))
            }
          </TextField>

          <FormControl fullWidth className={classes.formControl}>
            <InputLabel id="demo-mutiple-chip-label">Destinatarios</InputLabel>
            <Select
              labelId="demo-mutiple-chip-label"
              id="demo-mutiple-chip"
              multiple
              fullWidth
              value={destinatarios}
              onChange={handleChange}
              input={<Input id="select-multiple-chip" />}
              renderValue={(selected) => (
                <div className={classes.chips}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} className={classes.chip} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {
                props.destinatarios.map((name) => (
                  <MenuItem key={name} value={name} style={getStyles(name, props.destinatarios, theme)}>
                    {name}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <TextField
            id="time"
            label="Horario"
            type="time"
            fullWidth
            defaultValue=""
            className={classes.textField}
            onChange={handleHoraChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
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