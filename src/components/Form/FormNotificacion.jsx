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
import { useSelector } from 'react-redux';
import FlagIcon from '@material-ui/icons/Flag';
import { IconButton } from '@material-ui/core';
import { Tooltip } from '@material-ui/core';

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

  const place = useSelector((state) => state.places.selectedPlace);

  const [openNoti, setOpenNoti] = useState(false);
  const handleClickOpenNoti = () => {
    setOpenNoti(true);
  };

  const handleCloseNoti = () => {
    setOpenNoti(false);
    formik.resetForm();
  };
  const formik = useFormik({
    initialValues: {
      mensaje: ''
    },
    onSubmit: (values) => {

      console.log(place.id);
      let categoria;
      if ('accesibilidad' in place.historial[Object.keys(place?.historial)[0]]) {
        categoria = 'Biciparqueo'
      } else if ('nombre' in place.historial[Object.keys(place?.historial)[0]]) {
        categoria = 'Servicio'
      } else if ('fecha_observacion' in place.historial[Object.keys(place?.historial)[0]]) {
        categoria = 'Aforo'
      } else if ('tipo_incidente' in place.historial[Object.keys(place?.historial)[0]]) {
        categoria = 'Denuncia'
      }
      if (user) {
        sendNotification(values.mensaje, place.id, categoria);
        formik.resetForm();
        handleCloseNoti();
        alert('Notificacion enviada con éxito');
      } else {
        alert("Necesitas iniciar sesión para subir datos.");
      }
    },
    validate: values => {
      let errors = {};
      if (values.mensaje.length < 11) {
        errors.mensaje = 'El mensaje debe tener más de 10 letras.'
      };
      return errors;
    }
  });

  const sendNotification = (mensaje, idPunto, categoria) => {
    const notificacion = {
      correo_usuario: user.email,
      nombre_usuario: user.displayName,
      uid: user.uid,
      mensaje: mensaje,
      categoria: categoria,
      id_punto: idPunto
    };
    let idNotificacion = db.collection("notificaciones").doc().id;
    db.collection("notificaciones").doc(idNotificacion).set(notificacion);
  }



  return (
    <div>
      <Tooltip title="Notificar" arrow>
        <IconButton type="button" onClick={handleClickOpenNoti}>
          <FlagIcon />
        </IconButton>
      </Tooltip>
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
              error={formik.touched.mensaje && Boolean(formik.errors.mensaje)}
              helperText={formik.touched.mensaje && formik.errors.mensaje}
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
    </div>
  );
}
