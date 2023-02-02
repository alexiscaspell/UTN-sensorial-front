import React, { useState } from "react";
import {
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  Button
} from "@material-ui/core";
import { MoreVert as MoreIcon } from "@material-ui/icons";
import classnames from "classnames";
import { useUserState } from "../../context/UserContext";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Indicadores from "../../pages/admin/dashboard/indicadores/ActualizarIndicadores";

// styles
import useStyles from "./styles";

export default function Widget({
  children,
  title,
  noBodyPadding,
  bodyClass,
  disableWidgetMenu,
  header,
  noHeaderPadding,
  headerClass,
  style,
  noWidgetShadow,
  ...props
}) {
  var classes = useStyles();

  // local
  var [moreButtonRef, setMoreButtonRef] = useState(null);
  var [isMoreMenuOpen, setMoreMenuOpen] = useState(false);
  var { isAdmin } = useUserState();
  var [open, setOpen] = React.useState(false);
  var [openUpdate, setOpenUpdate] = React.useState(false);


  const handleHistoric = function(e) {
    setMoreMenuOpen(false);
    props.setHistoric();
  }

  const handleClickOpen = () => {
    setOpen(true);
    setMoreMenuOpen(false);
  };

  const handleClickOpenUpdate = () => {
    setOpenUpdate(true);
    setMoreMenuOpen(false);
  };

  const handleCloseAlert = () => {
    setOpen(false);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleDeleteIndicator = () => {
    handleCloseAlert()
    props.handleDeleteIndicator(props.indicadorId)
  }

  return (
    <div className={classes.widgetWrapper} style={style && {...style}}>
      <Paper className={classes.paper} classes={{ root: classnames(classes.widgetRoot, {
        [classes.noWidgetShadow]: noWidgetShadow
        }) }}>
        <div className={classnames(classes.widgetHeader, {
          [classes.noPadding]: noHeaderPadding,
          [headerClass]: headerClass
        })}>
          {header ? (
            header
          ) : (
            <React.Fragment>
              <Typography variant="h5" color="textSecondary" noWrap>
                {title}
              </Typography>
              
                {!props.obj && <IconButton
                  color="primary"
                  classes={{ root: classes.moreButton }}
                  aria-owns="widget-menu"
                  aria-haspopup="true"
                  onClick={() => setMoreMenuOpen(true)}
                  ref={setMoreButtonRef}
                >
                  <MoreIcon />
                </IconButton>}
              
            </React.Fragment>
          )}
        </div>
        <div
          className={classnames(classes.widgetBody, {
            [classes.noPadding]: noBodyPadding,
            [bodyClass]: bodyClass,
          })}
        >
          {children}
        </div>
      </Paper>
      {
      <Menu
        id="widget-menu"
        open={isMoreMenuOpen}
        anchorEl={moreButtonRef}
        onClose={() => setMoreMenuOpen(false)}
        disableAutoFocusItem
      >
        <MenuItem onClick={handleHistoric}>
          <Typography>Ver histórico</Typography>
        </MenuItem>
        {
          isAdmin && 
          <MenuItem onClick={handleClickOpenUpdate} >
            <Typography>Actualizar</Typography>
          </MenuItem>
        }
        {
          isAdmin && 
          <MenuItem onClick={handleClickOpen} >
            <Typography>Borrar</Typography>
          </MenuItem>
        }
      </Menu>}
      {openUpdate && <Indicadores 
        handleNewNotification={props.handleNewNotification} 
        isOpen={openUpdate} 
        handleClose={handleCloseUpdate} 
        dashboardId={props.actualBoardId} 
        tipo={"Actualizar"}
        titulo={"Actualizar Indicador"}
        handleCreate={props.handleUpdateIndicator}
        indicator={props.indicator}
      />}
      <Dialog
        open={open}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"¿Deseas borrar el indicador?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            En caso de aceptar el indicador sera borrado de forma irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteIndicator} color="primary" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
