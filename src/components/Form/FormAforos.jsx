import { useStore } from "../../store/context";
import "./Form.css";
import { Field, Formik, Form as FormikForm } from "formik";
import DateFnsUtils from '@date-io/date-fns';
import esLocale from "date-fns/locale/es";

import db from "../../database/firebase";
import { auth } from "../../database/firebase";
import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { useEffect, useState } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from "@material-ui/core";
import { useNavigate } from "react-router-dom";


const dateFns = new DateFnsUtils();


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10em'
  }
}));


const Form = () => {
  const [user, setUser] = useState(null);
  const { state, dispatch } = useStore();
  const position = state.prePlacePosition;
  const placeSelect = state.selectedPlace;

  const closeForm = () => {
    dispatch({ type: "SET_PLACE_FORM_VISIBILITY", payload: false });
  };

  const addNewPlace = (place) => {
    dispatch({ type: "ADD_NEW_PLACE", payload: place });
  };


  const navigate = useNavigate();
  useEffect(() => {
    auth.onAuthStateChanged(persona => {
      if (persona) {
        setUser(persona);
      } else {
        setUser(null);
      }
    })
  }, [])

  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const initialValues = {
    tipo: "aforos",
    fecha: null,
    tiempoInicio: null,
    tiempoFin: null,
    numCiclistas: 0,
    numMujeres: 0,
    numHombres: 0
  };

  const validator = (values) => {
    const errors = {};
    if (!values.fecha) {
      errors.fecha = "Requerido";
    }
    if (!values.tiempoInicio) {
      errors.tiempoInicio = "Requerido";
    }
    if (!values.tiempoFin) {
      errors.tiempoFin = "Requerido";
    }
    if (!values.numCiclistas) {
      errors.numCiclistas = "Requerido";
    }

    return errors;
  };

  const handleOnSubmit = (values, actions) => {
    if (user) {
      if (placeSelect == null) {
        const newAforo = {
          ...values,
          position: [position.lat, position.lng]
        };
        uploadData(newAforo)
        addNewPlace(newAforo);
        actions.resetForm({});
        closeForm();
        // alert('Punto nuevo enviado correctamente');
        navigate("/");

      } else {
        const newAforo = {
          ...values
        };
        updateAforo(newAforo, placeSelect.id)
        actions.resetForm({});
        closeForm();
        // alert('Punto actualizado correctamente');
        navigate("/");
      }

    } else {
      alert("Necesitas iniciar sesión para subir datos.");
    }

  }
  const uploadData = (object) => {
    setLoading(true);
    const map = {
      nombre_usuario: user.displayName,
      correo_usuario: user.email,
      uid: user.uid
    };

    //Formatear la estructura del objeto
    let aforoFormated = formaterAforo(object);
    //Cambiando la estructura del Aforo
    let idVersion = db.collection("aforos2").doc().id;
    let version = {
      hora_fin_observacion: dateFns.format(object.tiempoFin, "HH:mm"),
      hora_inicio_observacion: dateFns.format(object.tiempoInicio, "HH:mm"),
      nro_ciclistas_observados: object.numCiclistas,
      timestamp: new Date(),
      fecha_observacion: dateFns.format(object.fecha, "dd-MM-yyyy"),
      nro_hombres: object.numHombres,
      nro_mujeres: object.numMujeres,
      id2: db.collection("conf2").doc().id
    };
    let aforoHistorial = {};
    aforoHistorial['historial.' + idVersion] = version;
    //Subir datos a Firestore
    //Primero subimos el aforo con los datos que no cambian. Ej> id, latitud longitud
    db.collection("aforos2").doc(aforoFormated.id).set(aforoFormated).then((e) => {
      //Ahora se sube el historial del aforo como actualizacion solo del campo historial
      db.collection("aforos2").doc(aforoFormated.id).update(aforoHistorial).then(e => {
        db.collection("conf2").doc(version.id2).set(map).then(element => {
          setLoading(false);
          window.location.reload()
          alert('Punto nuevo enviado correctamente');
        }).catch((error) =>
          console.log(error)
        )
      })

    })
      // .then(element => {

      // })
      .catch((error) =>
        console.log(error)
      )
  }
  const formaterAforo = (afo) => {
    let idafo = db.collection("aforos2").doc().id;
    let data = {
      id: idafo,
      // hora_fin_observacion: dateFns.format(afo.tiempoFin, "HH:mm"),
      // hora_inicio_observacion: dateFns.format(afo.tiempoInicio, "HH:mm"),
      // nro_ciclistas_observados: afo.numCiclistas,
      latitud: afo.position[0],
      // timestamp: new Date(),
      // fecha_observacion: dateFns.format(afo.fecha, "dd-MM-yyyy"),
      // nro_hombres: afo.numHombres,
      // nro_mujeres: afo.numMujeres,
      longitud: afo.position[1],
      // id2: db.collection("conf").doc().id
    };
    return data;
  }
  const updateAforo = (actualizacion, idPunto) => {
    setLoading(true);
    const map = {
      correo_usuario: user.email,
      nombre_usuario: user.displayName,
      uid: user.uid
    };
    //Estructura del Aforo
    let idVersion = db.collection("aforos2").doc().id;
    let version = {
      hora_fin_observacion: dateFns.format(actualizacion.tiempoFin, "HH:mm"),
      hora_inicio_observacion: dateFns.format(actualizacion.tiempoInicio, "HH:mm"),
      nro_ciclistas_observados: actualizacion.numCiclistas,
      timestamp: new Date(),
      fecha_observacion: dateFns.format(actualizacion.fecha, "dd-MM-yyyy"),
      nro_hombres: actualizacion.numHombres,
      nro_mujeres: actualizacion.numMujeres,
      id2: db.collection("conf2").doc().id
    };
    let aforoHistorial = {};
    aforoHistorial['historial.' + idVersion] = version;
    //Subir datos a Firestore
    //Se sube el historial del aforo como actualizacion solo del campo historial
    db.collection("aforos2").doc(idPunto).update(aforoHistorial).then(e => {
      db.collection("conf2").doc(version.id2).set(map)
        .then(element => {
          setLoading(false);
          window.location.reload();
          alert('Punto actualizado correctamente');
        })
    })

  }

  return (
    loading ? <div className={classes.root}><CircularProgress /><p>Enviando...</p></div> :
      <div
        className={`subform__container form__container--${state.placeFormIsVisible && "active"}`}
      >

        <Formik
          initialValues={initialValues}
          validate={validator}
          onSubmit={handleOnSubmit}
        >
          {({ errors, touched, isValidating, setFieldValue, values }) => (

            <FormikForm>
              <div className="formGroup">
                <div className="formGroupInput">
                  <label htmlFor="fecha">Fecha</label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                    <Field
                      autoOk={true}
                      cancelLabel="Cancelar"
                      component={DatePicker}
                      id="fecha"
                      name="fecha"
                      format="dd-MM-yyyy"
                      value={values.fecha}
                      invalidDateMessage=""
                      placeholder=""
                      onChange={
                        value => { setFieldValue("fecha", value) }
                      } />
                  </MuiPickersUtilsProvider>

                </div>
                <div className="errors">{errors.fecha}</div>
              </div>
              <div className="formGroup">
                <div className="formGroupInput">
                  <label htmlFor="tiempoInicio">Tiempo de inicio</label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Field
                      autoOk={true}
                      component={TimePicker}
                      id="tiempoInicio"
                      name="tiempoInicio"
                      value={values.tiempoInicio}
                      invalidDateMessage=""
                      placeholder=""
                      ampm={false}
                      onChange={
                        value => { setFieldValue("tiempoInicio", value) }
                      } />
                  </MuiPickersUtilsProvider>
                </div>
                <div className="errors">{errors.tiempoInicio}</div>
              </div>
              <div className="formGroup">
                <div className="formGroupInput">
                  <label htmlFor="tiempoFin">Tiempo de fin</label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Field
                      autoOk={true}
                      component={TimePicker}
                      id="tiempoFin"
                      name="tiempoFin"
                      value={values.tiempoFin}
                      invalidDateMessage=""
                      placeholder=""
                      ampm={false}
                      onChange={
                        value => { setFieldValue("tiempoFin", value) }
                      } />
                  </MuiPickersUtilsProvider>
                </div>
                <div className="errors">{errors.tiempoFin}</div>
              </div>
              <div className="formGroup">
                <div className="formGroupInput">
                  <label htmlFor="numCiclistas">Número de ciclistas observados</label>
                  <Field id="numCiclistas" name="numCiclistas" type="number" min="1" />
                </div>
                <div className="errors"> {errors.numCiclistas}</div>
              </div>
              <div className="formGroup">
                <div className="formGroupInput">
                  <label htmlFor="numMujeres">Número de mujeres</label>
                  <Field id="numMujeres" name="numMujeres" type="number" min="0" />
                </div>
                <div className="errors">{errors.numMujeres}</div>
              </div>
              <div className="formGroup">
                <div className="formGroupInput">
                  <label htmlFor="numHombres">Número de hombres</label>
                  <Field id="numHombres" name="numHombres" type="number" min="0" />
                </div>
                <div className="errors">{errors.numHombres}</div>
              </div>

              <div className="button__container">
                <button className="form__button" type="submit">Enviar</button>
              </div>
            </FormikForm>
          )}
        </Formik>
      </div>
  );
};

export default Form;