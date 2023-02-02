import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from '@material-ui/styles';
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
    FormControl,
    InputLabel,
    Select,
    Chip,
    Input,
    Box,
} from "@material-ui/core";
import {getSensores, saveIndicator} from '../../../../api/Api'
import {handleLineColor, getUnit} from "../../../../utils/utils"

function rand() {
  return Math.round(Math.random() * 20) - 10;
}


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const tipos = [
  {
    value: 'produccion',
    label: 'Producción',
  },
  {
    value: 'temperatura',
    label: 'Temperatura',
  },
  {
    value: 'humedad',
    label: 'Humedad',
  },
  {
    value: 'calidad_del_aire',
    label: 'Calidad del aire',
  },
]

const limites = [
  {
    value: '0',
    label: 'Superior',
  },
  {
    value: '1',
    label: 'Inferior',
  },
  {
    value: '2',
    label: 'Ambos',
  },
]

export default function SimpleModal(props) {
  const theme = useTheme();
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [nombre, setNombre] = React.useState();
  const [tipoIndicador, setTipoIndicador] = React.useState();
  const [sensors, setSensors] = React.useState([]);
  const [selectedSensors, setSelectedSensors] = React.useState([]);
  const [sensorsId, setSensorsIds] = React.useState([]);
  const [disable, setDisabled] = React.useState(true);
  const [inferior, setInferior] = React.useState();
  const [superior, setSuperior] = React.useState();
  const [refreshRate, setRefreshRate] = React.useState();

  const handleNameChange = function(e) {
    setNombre(e.target.value);
  }

  const handleTipoChange = function(e) {
    setSelectedSensors([])
    setSensorsIds([])
    setTipoIndicador(e.target.value);
  }

  const handleChange = (e) => {
    console.log(e.target.value)
    setSelectedSensors(e.target.value);
  };

  const handleDisable = () => {
    console.log((!!superior && !inferior) || (!superior && !!inferior))
    console.log((!!superior && !!inferior && superior > inferior))
    if (!!refreshRate && refreshRate>0 && !!nombre && !!tipoIndicador && selectedSensors.length > 0 && selectedSensors.length < 4 && 
      ((!!superior && !!inferior && Number(superior) > Number(inferior)) || ( (!!superior && !inferior) || (!superior && !!inferior)))) {
        setDisabled(false)
      } else {
      setDisabled(true)
    }
  }

  const handleLimiteSuperior = (e) => {
      setSuperior(e.target.value)
  }

  const handleLimiteInferior = (e) => {
      setInferior(e.target.value)
  }

  const handleRefreshRate = (e) => {
    setRefreshRate(e.target.value)
  }

  const handleClose = () => {
    setNombre("")
    setSelectedSensors([])
    setSensorsIds([])
    setTipoIndicador("")
    setRefreshRate()
    setInferior()
    setSuperior()
    props.handleClose()
  };

  const handleCreate = async () => {
    props.handleCreate(sensors, nombre, tipoIndicador, inferior, superior, refreshRate, selectedSensors) 
  };

  useEffect(() => { //tiene que haber un useEffect por cada variable de estado de chart a modificar
    async function getInitialDashs(){
      await getModalStyle()
    }
    getInitialDashs();
  },[]);

  const handleFetchSensores = async () => {
    let res = await getSensores(tipoIndicador);
    if (res.ok){
      let data = await res.json();
      console.log(data)

      setSensors(data)
      //setSensorsIds(sensorsIds)
    }
  }

  useEffect(() => { //tiene que haber un useEffect por cada variable de estado de chart a modificar
    async function fetchSensores(){
      if(!!tipoIndicador)
        await handleFetchSensores()

    }
    fetchSensores();

  },[tipoIndicador]);

  useEffect(() => { //tiene que haber un useEffect por cada variable de estado de chart a modificar
    async function disable(){
      handleDisable()
    }
    disable();

  },[nombre,tipoIndicador,selectedSensors,superior,inferior,refreshRate]);

  return (
    <div>
      <Dialog open={props.isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{props.titulo}</DialogTitle>
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
            id="outlined-select"
            margin="dense"
            select
            label="Tipo de indicador"
            fullWidth
            onChange={handleTipoChange}
          >
            {
              tipos.map((option, index) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))
            }
          </TextField>
          <FormControl fullWidth className={classes.formControl}>
            <InputLabel id="demo-mutiple-chip-label">Sensores</InputLabel>
            <Select
              labelId="demo-mutiple-chip-label"
              id="demo-mutiple-chip"
              multiple
              fullWidth
              value={selectedSensors}
              onChange={handleChange}
              input={<Input id="select-multiple-chip"/>}
              renderValue={(selected) => (
                <div className={classes.chips}>
                  {selected.map((value, index) => (
                    <Chip key={value} label={value} className={classes.chip} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {
                sensors.map((sensor, index) => (
                  <MenuItem key={index} value={sensor.nombre} /*style={getStyles(sensor.nombre, sensors, theme)}*/>
                    {sensor.nombre}
                  </MenuItem>
                ))
              }
            </Select>

          </FormControl>
          <Box justifyContent="space-between">
            <TextField
              id="outlined-select"
              margin="dense"
              label={ !tipoIndicador ? "Limite superior" : `Limite superior [${getUnit(tipoIndicador)}]`}
              onChange={handleLimiteSuperior}
              >
            </TextField>
              &nbsp;&nbsp;&nbsp;
            <TextField
              id="outlined-select"
              margin="dense"
              label={ !tipoIndicador ? "Limite inferior" : `Limite inferior [${getUnit(tipoIndicador)}]`}
              onChange={handleLimiteInferior}
              >
            </TextField>
          </Box>
          <TextField
              id="outlined-select"
              margin="dense"
              label="Tasa de refresco [seg]"
              onChange={handleRefreshRate}
              >
          </TextField>
         
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary" disabled={disable}>
            {props.tipo}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}