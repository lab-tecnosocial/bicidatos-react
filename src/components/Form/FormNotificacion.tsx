import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import db, { auth } from '../../database/firebase';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useEffect } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { useSelector } from 'react-redux';
import FlagIcon from '@material-ui/icons/Flag';
import { IconButton } from '@material-ui/core';
import Flag from '@material-ui/icons/Flag';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#21DFDF'
    }
  }
});

export default function FormNotificacion() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged(persona => {
      if (persona) {
        setUser(persona);
      } else {
        setUser(null);
      }
    })
  }, [])

  const place = useSelector((state: any) => state.places.selectedPlace);

  const [openNoti, setOpenNoti] = useState(false);
  const handleClickOpenNoti = () => {
    setOpenNoti(true);
  };

  const handleCloseNoti = () => {
    setOpenNoti(false);
  };
  const formik = useFormik({
    initialValues: {
      mensaje: ''
    },
    onSubmit: (values) => {
      console.log(place.id);
      sendNotification(values.mensaje, place.id);
      formik.resetForm();
      handleCloseNoti();
      alert('Notificacion enviada con éxito');
    }
  });

  const sendNotification = (mensaje: String, idPunto: String) => {
    const notificacion = {
      correo_usuario: user.displayName,
      nombre_usuario: user.email,
      uid: user.uid,
      mensaje: mensaje,
      categoria: "Biciparqueo",
      id_punto: idPunto
    };
    let idNotificacion = db.collection("notificaciones").doc().id;
    db.collection("notificaciones").doc(idNotificacion).set(notificacion);
  }



  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <IconButton type="button" onClick={handleClickOpenNoti}>
          <FlagIcon />
        </IconButton>
        <Dialog open={openNoti} onClose={handleCloseNoti} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Notificar</DialogTitle>
          <form onSubmit={formik.handleSubmit}>
            <DialogContent>
              <DialogContentText>
                Si encuentras algun problema con la información de este punto, puedes notificarlo aquí para que los administradores lo revisen.
              </DialogContentText>
              <TextField
                autoFocus
                multiline
                value={formik.values.mensaje}
                margin="dense"
                id="mensaje"
                label="Mensaje"
                fullWidth
                rows="4"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseNoti} >
                Cancelar
              </Button>
              <Button type="submit" >
                Enviar
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </MuiThemeProvider>
    </div>
  );
}
