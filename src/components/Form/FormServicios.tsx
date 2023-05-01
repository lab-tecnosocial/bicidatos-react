import { connect } from "react-redux";
import { addNewPlace as addNewPlaceAction, setPlaceFormVisibility } from "../../store/actions";
import "./Form.css";
import { Field, Formik, Form as FormikForm } from "formik";
import { LatLng } from "leaflet";
import { useRef } from "react";
import db, { storageRef } from "../../database/firebase";
import { auth, provider } from "../../database/firebase";
import { useEffect, useState } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10em'
  }
}));

const Form = ({
  isVisible,
  position,
  closeForm,
  addNewPlace,
  placeSelect
}: {
  isVisible: boolean;
  position: LatLng;
  closeForm: Function;
  addNewPlace: Function;
  placeSelect: any;
}) => {
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

  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const initialValues = {
    tipo: "servicios",
    nombre: "",
    tipoServicio: "",
    descripcion: "",
    sitioWeb: "",
    telefono: "",
    fotografia: ""

  };

  // Variables para validacion de fotografia
  const FILE_SIZE = 3 * 1024 * 1024;  // solo 3MB
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/png"
  ];

  const fotoRef = useRef(null);

  const validator = (values: PlaceFormServiciosProps) => {
    const errors: any = {};
    if (!values.nombre) {
      errors.nombre = "Requerido";
    }

    if (values.nombre.length < 3) {
      errors.nombre = "Debe contener más de 3 letras";
    }

    if (!values.tipoServicio) {
      errors.tipoServicio = "Requerido";
    }
    if (!values.telefono) {
      errors.telefono = "Requerido";
    }

    if (values.telefono.length < 7) {
      errors.telefono = "Debe tener más de 6 digitos";
    }

    if (!values.fotografia) {
      errors.fotografia = "Requerido";
    }
    if (!SUPPORTED_FORMATS.includes(values.fotografia.type)) {
      errors.fotografia = "Debe ser una imagen .jpg o .png";
    }

    if (values.fotografia.size > FILE_SIZE) {
      errors.fotografia = "Debe ser menor de 3MB";
    }

    return errors;
  };

  const handleOnSubmit = (values: PlaceFormServiciosProps, actions: any) => {
    if (user) {

      if (placeSelect == null) {
        const newServicio = {
          ...values,
          position: [position.lat, position.lng]
        };
        uploadPhotoAndData(newServicio);
        addNewPlace(newServicio);
        actions.resetForm({});
        fotoRef.current.value = null;
        closeForm();
        // alert('Punto nuevo enviado correctamente');

      } else {
        const newServicio = {
          ...values
        };
        updateServicio(newServicio, placeSelect.id)
        actions.resetForm({});
        fotoRef.current.value = null;
        closeForm();
        // alert('Punto actualizado correctamente');
      }

    } else {
      alert("Necesitas iniciar sesión para subir datos.");
    }

  }
  const uploadPhotoAndData = (object: any) => {
    setLoading(true);
    const map = {
      correo_usuario: user.email,
      nombre_usuario: user.displayName,
      uid: user.uid
    };
    //Subir la imagen a Storage para obtener la url de la imagen
    const uploadTask = storageRef.ref(`imagenesServicios/${new Date().getTime() + "_" + object.fotografia.name}`)
      .put(object.fotografia).then(data => {
        data.ref.getDownloadURL().then(url => {
          //Despues, Formatear la estructura del objeto con la url obtenida de la imagen
          let servicioFormated = formaterServicio(object, url);
          //Cambiando la estructura del Servicio
          let idVersion = db.collection("servicios2").doc().id;
          let version = {
            descripcion: object.descripcion,
            nombre: object.nombre,
            fotografia: url,
            timestamp: new Date(),
            sitioweb: object.sitioWeb,
            telefono: parseInt(object.telefono),
            tipo: object.tipoServicio,
            id2: db.collection("conf2").doc().id
          };
          let servicioHistorial = {};
          servicioHistorial['historial.' + idVersion] = version;
          //Subir datos a Firestore
          //Primero subimos el servicio con los datos que no cambian. Ej> id, latitud longitud
          db.collection("servicios2").doc(servicioFormated.id).set(servicioFormated).then(nada => {
            //Ahora se sube el historial del servicio como actualizacion solo del campo historial
            db.collection("servicios2").doc(servicioFormated.id).update(servicioHistorial).then(e => {
              db.collection("conf2").doc(version.id2).set(map)
                .then(element => {
                  setLoading(false);
                  window.location.reload()
                  alert('Punto nuevo enviado correctamente');
                })
            })

          })
        })
      })
  }
  const formaterServicio = (serv: any, urlImage: string) => {
    let idserv = db.collection("servicios2").doc().id;
    let data = {
      id: idserv,
      // descripcion: serv.descripcion,
      // nombre: serv.nombre,
      // fotografia: urlImage,
      latitud: serv.position[0],
      // timestamp: new Date(),
      // sitioweb: serv.sitioWeb,
      // telefono: parseInt(serv.telefono),
      // tipo: serv.tipoServicio,
      longitud: serv.position[1],
      // id2: db.collection("conf").doc().id
    };
    return data;
  }
  const updateServicio = (actualizacion: any, idPunto: any) => {
    setLoading(true);
    const map = {
      correo_usuario: user.email,
      nombre_usuario: user.displayName,
      uid: user.uid
    };
    //Subir la imagen a Storage para obtener la url de la imagen
    const uploadTask = storageRef.ref(`imagenesServicios/${new Date().getTime() + "_" + actualizacion.fotografia.name}`)
      .put(actualizacion.fotografia).then(data => {
        data.ref.getDownloadURL().then(url => {

          //Estructura del Servicio
          let idVersion = db.collection("servicios2").doc().id;
          let version = {
            descripcion: actualizacion.descripcion,
            nombre: actualizacion.nombre,
            fotografia: url,
            timestamp: new Date(),
            sitioweb: actualizacion.sitioWeb,
            telefono: parseInt(actualizacion.telefono),
            tipo: actualizacion.tipoServicio,
            id2: db.collection("conf2").doc().id
          };
          let servicioHistorial = {};
          servicioHistorial['historial.' + idVersion] = version;
          //Subir datos a Firestore

          //Se sube el historial del servicio como actualizacion solo del campo historial
          db.collection("servicios2").doc(idPunto).update(servicioHistorial).then(e => {
            db.collection("conf2").doc(version.id2).set(map)
              .then(element => {
                setLoading(false);
                window.location.reload();
                alert('Punto actualizado correctamente');
              })
          })


        })
      })
  }

  return (
    loading ? <div className={classes.root}><CircularProgress /><p>Enviando...</p></div> :
      <div
        className={`subform__container form__container--${isVisible && "active"}`}
      >
        <Formik
          initialValues={initialValues}
          validate={validator}
          onSubmit={handleOnSubmit}
        >
          {({ errors, touched, isValidating, setFieldValue }) => (
            <FormikForm>
              <div className="formGroup">
                <div className="formGroupInput">
                  <label htmlFor="nombre">Nombre</label>
                  <Field id="nombre" name="nombre" />
                </div>
                <div className="errors">{errors.nombre}</div>
              </div>
              <div className="formGroup">
                <div className="formGroupInput">
                  <label htmlFor="tipoServicio">Tipo de servicio</label>
                  <Field id="tipoServicio" name="tipoServicio" as="select" >
                    <option hidden >Selecciona una opción</option>
                    <option value="Tienda de bicicleta">Tienda de bicicleta</option>
                    <option value="Taller de repuestos">Taller de repuestos</option>
                    <option value="Llantería de bicicleta">Llantería de bicicleta</option>
                  </Field>
                </div>
                <div className="errors">{errors.tipoServicio}</div>
              </div>
              <div className="formGroup">
                <div className="formGroupInput">
                  <label htmlFor="descripcion">Descripción</label>
                  <Field id="descripcion" name="descripcion" as="textarea" />
                </div>
                <div className="errors">{errors.descripcion}</div>
              </div>
              <div className="formGroup">
                <div className="formGroupInput">
                  <label htmlFor="sitioWeb">Sitio web</label>
                  <Field id="sitioWeb" name="sitioWeb" />
                </div>
                <div className="errors">{errors.sitioWeb}</div>
              </div>
              <div className="formGroup">
                <div className="formGroupInput">
                  <label htmlFor="telefono">Telefono</label>
                  <Field id="telefono" name="telefono" type="number" min="1" />
                </div>
                <div className="errors">{errors.telefono}</div>
              </div>
              <div className="formGroup">
                <div className="formGroupInput">
                  <label htmlFor="fotografia">Fotografía</label>
                  <input id="fotografia" name="fotografia" type="file" className="form-control" onChange={(event) => {
                    setFieldValue("fotografia", event.currentTarget.files![0]);
                  }} ref={fotoRef} />
                </div>
                <div className="errors">{errors.fotografia}</div>
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

const mapStateToProps = (state: any) => {
  const { places } = state;
  return {
    isVisible: places.placeFormIsVisible,
    position: places.prePlacePosition as LatLng,
    placeSelect: places.selectedPlace
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    closeForm: () =>
      dispatch(setPlaceFormVisibility(false)),
    addNewPlace: (place: any) => {
      dispatch(addNewPlaceAction(place))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);

interface PlaceFormServiciosProps {
  [key: string]: string;
  tipo: string;
  nombre: string;
  tipoServicio: string;
  descripcion: string;
  sitioWeb: string;
  telefono: string;
  fotografia: any;
}
