import { connect } from "react-redux";
import { addNewPlace as addNewPlaceAction, setPlaceFormVisibility } from "../../store/actions";
import { Place, PlaceDenuncias } from "../../store/models";
import { AiFillCloseCircle } from "react-icons/ai";
import "./Form.css";
import { Field, Formik, Form as FormikForm } from "formik";
import { LatLng } from "leaflet";
import { useRef } from "react";
import DateFnsUtils from '@date-io/date-fns'; 
import esLocale from "date-fns/locale/es";

import db, { storageRef } from "../../database/firebase";
import {auth, provider} from "../../database/firebase";
import { useEffect, useState } from "react";
import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const dateFns = new DateFnsUtils();

const Form = ({
  isVisible,
  position,
  closeForm,
  addNewPlace
}: {
  isVisible: boolean;
  position: LatLng;
  closeForm: Function;
  addNewPlace: Function;
}) => {
  const [user,setUser] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged(persona =>{
      if (persona) {
        setUser(persona);
      }else{
        setUser(null);
      }
    })
  },[])
  const initialValues = {
    tipo: "denuncias",
    fecha: null,
    tipoIncidente: "",
    descripcion: "",
    enlace: "",
    fotografiaConf: ""
  
  };

  // Variables para validacion de fotografia
  const FILE_SIZE = 3 * 1024 * 1024;  // solo 3MB
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/png"
  ];

  const fotoRef = useRef(null);

  const validator = (values: PlaceFormDenunciasProps) => {
    const errors: any = {};
    if(!values.fecha){
      errors.fecha = "Requerido";
    }
    if(!values.tipoIncidente){
      errors.tipoIncidente = "Requerido";
    }

    if(!values.fotografiaConf){
      errors.fotografiaConf = "Requerido";
    }
    if(!SUPPORTED_FORMATS.includes(values.fotografiaConf.type) ){
      errors.fotografiaConf = "Debe ser una imagen .jpg o .png";
    }

    if(values.fotografiaConf.size > FILE_SIZE){
      errors.fotografiaConf = "Debe ser menor de 3MB";
    }

    return errors;
  };

  const handleOnSubmit = (values: PlaceFormDenunciasProps, actions: any) => {
    if(user){
      const newDenuncia = {
        ...values,
        position: [position.lat, position.lng]
      };
      console.log(newDenuncia);       // objeto a subir a backend
      console.log(values.fotografiaConf); // objeto de la imagen subida
      uploadPhotoAndData(newDenuncia);
      addNewPlace(newDenuncia);
      actions.resetForm({});
      fotoRef.current.value = null;
      closeForm();
      alert('Punto enviado correctamente');
    }else{
      alert("Necesitar iniciar sesión para subir datos.");
    }
    
  }
  const uploadPhotoAndData = (object:any) =>{
    //Subir la imagen a Storage para obtener la url de la imagen
    const uploadTask = storageRef.ref(`imagenesDenuncias/${ new Date().getTime() +"_"+object.fotografiaConf.name}`)
    .put(object.fotografiaConf).then(data =>{
      data.ref.getDownloadURL().then(url=>{
        //Despues, Formatear la estructura del objeto con la url obtenida de la imagen
        let denunciaFormated = formaterDenuncia(object);
        //Subir datos a Firestore
        const map = {
          correo_usuario:user.displayName,
          nombre_usuario:user.email,
          uid:user.uid,
          fotografia:url
        };
        db.collection("denuncias").doc(denunciaFormated.id).set(denunciaFormated).then(nada=>{
          db.collection("conf").doc(denunciaFormated.id2).set(map)
        })
      })
    })
  }
const formaterDenuncia = (denu:any) =>{
  let iddenu = db.collection("denuncias").doc().id;
  let data = {
    id:iddenu,
    descripcion:denu.descripcion,
    enlace:denu.enlace,
    latitud:denu.position[0],
    timestamp:new Date(),
    fecha_incidente:denu.fecha.toString(),
    tipo_incidente: denu.tipoIncidente,
    longitud: denu.position[1],
    id2:db.collection("conf").doc().id
  };
  return data;
}
  return (
    <div
      className={`subform__container form__container--${isVisible && "active"}`}
    >
    
      <Formik
        initialValues={initialValues}
        validate={validator}
        onSubmit={handleOnSubmit}
      >
        {({ errors, touched, isValidating, setFieldValue, values}) => (
          <FormikForm>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="fecha">Fecha del incidente</label>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                  <Field 
                  autoOk
                  cancelLabel="Cancelar"
                  component={DatePicker} 
                  id="fecha" 
                  name="fecha"
                  value={values.fecha}
                  format="dd-MM-yyyy"
                  invalidDateMessage=""
                  placeholder = ""
                  maxDate = {new Date()}
                  maxDateMessage = "La fecha no puede estar en el futuro"
                  onChange={
                    value => { 
                      setFieldValue("fecha", dateFns.format(value, "dd-MM-yyyy"))
                    }
                  } />
                </MuiPickersUtilsProvider>
              </div>
               <div className="errors">{errors.fecha}</div>
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="tipoIncidente">Tipo de incidente</label>
                <Field id="tipoIncidente" name="tipoIncidente" as="select" >
                  <option hidden >Selecciona una opción</option>
                  <option value="Invasión vehicular">Invasión vehicular</option>
                  <option value="Invasión comercial">Invasión comercial</option>
                  <option value="Atropello a ciclista">Atropello a ciclista</option>
                  <option value="Agresión física<">Agresión física</option>
                  <option value="Agresión verbal">Agresión verbal</option>
                  <option value="Manoseo">Manoseo</option>
                  <option value="Daño a infraestructura ciclista">Daño a infrestructura ciclista</option>
                </Field>
              </div>
               <div className="errors">{errors.tipoIncidente}</div>
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="descripcion">Descripción</label>
                <Field id="descripcion" name="descripcion" />
              </div>
              <div className="errors">{errors.descripcion}</div>
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="enlace">Enlace</label>
                <Field id="enlace" name="enlace" />
              </div>
               <div className="errors">{errors.enlace}</div>
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="fotografiaConf">Fotografía</label>
                <input id="fotografiaConf" name="fotografiaConf" type="file"  className="form-control" onChange={(event) => {
  setFieldValue("fotografiaConf", event.currentTarget.files![0]);
}} ref={fotoRef} />
              </div>
               <div className="errors">{errors.fotografiaConf}</div>
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

interface PlaceFormDenunciasProps {
  [key: string]: string;
  tipo: string;
  fecha: string;
  tipoIncidente: string;
  descripcion: string;
  enlace: string;
  fotografiaConf: any;
}
