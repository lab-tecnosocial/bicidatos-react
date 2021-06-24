import { connect } from "react-redux";
import { addNewPlace as addNewPlaceAction, setPlaceFormVisibility } from "../../store/actions";
import { Place, PlaceAforos } from "../../store/models";
import { AiFillCloseCircle } from "react-icons/ai";
import "./Form.css";
import { Field, Formik, Form as FormikForm, validateYupSchema } from "formik";
import { LatLng } from "leaflet";
import DateFnsUtils from '@date-io/date-fns';
import esLocale from "date-fns/locale/es";

import db, { storageRef } from "../../database/firebase";
import {auth, provider} from "../../database/firebase";
import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { useEffect, useState } from "react";

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
    tipo: "aforos",
    fecha: null,
    tiempoInicio: null,
    tiempoFin: null,
    numCiclistas: "",
    numMujeres: "",
    numHombres: ""
  };
  
  const validator = (values: PlaceFormAforosProps) => {
    const errors: any = {};
    if(!values.fecha){
      errors.fecha = "Requerido";
    }
    if(!values.tiempoInicio){
      errors.tiempoInicio = "Requerido";
    }
    if(!values.tiempoFin){
      errors.tiempoFin = "Requerido";
    }
    if(!values.numCiclistas){
      errors.numCiclistas = "Requerido";
    }

    return errors;
  };

  const handleOnSubmit = (values: PlaceFormAforosProps, actions: any) => {
    if(user){
      const newAforo = {
      ...values,
      position: [position.lat, position.lng]
    };
    console.log(newAforo); // objeto a subir a backend
    uploadData(newAforo);
    addNewPlace(newAforo);
    actions.resetForm({});
    closeForm();
    alert('Punto enviado correctamente');
    }else{
      alert("Necesitar iniciar sesión para subir datos.");
    }
    
  }
  const uploadData = (object:any) =>{
        const map = {
          correo_usuario:user.displayName,
          nombre_usuario:user.email,
          uid:user.uid
        };

        //Formatear la estructura del objeto
        let aforoFormated = formaterAforo(object);
        //Subir datos a Firestore
        db.collection("aforos").doc(aforoFormated.id).set(aforoFormated).then((e)=>{
          db.collection("conf").doc(aforoFormated.id2).set(map)
        }).catch((error)=>
          console.log(error)
        )
  }
const formaterAforo = (afo:any )=> {
  let idafo = db.collection("aforos").doc().id;
  let data = {
    id:idafo,
    hora_fin_observacion:afo.tiempoFin.toString(),
    hora_inicio_observacion:afo.tiempoInicio.toString(),
    nro_ciclistas_observados: afo.numCiclistas,
    latitud:afo.position[0],
    timestamp:new Date(),
    fecha_observacion:afo.fecha.toString(),
    nro_hombres: afo.numHombres,
    nro_mujeres: afo.numMujeres,
    longitud: afo.position[1],
    id2: db.collection("conf").doc().id
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
                <label htmlFor="fecha">Fecha</label>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                  <Field 
                  autoOk
                  cancelLabel="Cancelar"
                  component={DatePicker} 
                  id="fecha" 
                  name="fecha" 
                  format="dd/MM/yyyy"
                  value={values.fecha}
                  invalidDateMessage=""
                  placeholder=""
                  onChange={
                    value => { setFieldValue("fecha", dateFns.format(value, "dd-MM-yyyy")) }
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
                  component={TimePicker} 
                  id="tiempoInicio" 
                  name="tiempoInicio"
                  value={values.tiempoInicio}
                  invalidDateMessage=""
                  placeholder=""
                  ampm={false}
                  onChange={
                    value => { setFieldValue("tiempoInicio", dateFns.format(value, "HH:mm")) }
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
                  component={TimePicker} 
                  id="tiempoFin" 
                  name="tiempoFin" 
                  value={values.tiempoFin}
                  invalidDateMessage=""
                  placeholder=""
                  ampm={false}
                  onChange={
                    value => { setFieldValue("tiempoFin", dateFns.format(value, "HH:mm")) }
                  } />
                </MuiPickersUtilsProvider>
              </div>
               <div className="errors">{errors.tiempoFin}</div>
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="numCiclistas">Número de ciclistas observados</label>
                <Field id="numCiclistas" name="numCiclistas" type="number" min="1"/>
              </div>
             <div className="errors"> {errors.numCiclistas}</div>
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="numMujeres">Número de mujeres</label>
                <Field id="numMujeres" name="numMujeres" type="number" min="1" />
              </div>
              <div className="errors">{errors.numMujeres}</div>
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="numHombres">Número de hombres</label>
                <Field id="numHombres" name="numHombres" type="number" min="1" />
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

interface PlaceFormAforosProps {
  [key: string]: string;
  tipo: string;
  fecha: string;
  tiempoInicio: string;
  tiempoFin: string;
  numCiclistas: string;
  numMujeres: string;
  numHombres: string;
}
