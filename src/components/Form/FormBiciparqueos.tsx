import { connect } from "react-redux";
import { addNewPlace as addNewPlaceAction, setPlaceFormVisibility } from "../../store/actions";
import { Place, PlaceBiciparqueos } from "../../store/models";
import { AiFillCloseCircle } from "react-icons/ai";
import "./Form.css";
import { Field, Formik, Form as FormikForm } from "formik";
import { LatLng } from "leaflet";
import { useRef } from "react";
import db, { storageRef } from "../../database/firebase";
import {auth, provider} from "../../database/firebase";
import { useEffect, useState } from "react";
import Toast from "../Header/Toast";

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
    tipo: "biciparqueos",
    accesibilidad: "",
    senalizacion: "",
    seguridadPercibida: "",
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

  const validator = (values: PlaceFormBiciparqueosProps) => {
    const errors: any = {};
    if(!values.accesibilidad){
      errors.accesibilidad = "Requerido";
    }
    if(!values.senalizacion){
      errors.senalizacion = "Requerido";
    }
    if(!values.seguridadPercibida){
      errors.seguridadPercibidad = "Requerido";
    }
    if(!values.fotografia){
      errors.fotografia = "Requerido";
    }
    if(!SUPPORTED_FORMATS.includes(values.fotografia.type) ){
      errors.fotografia = "Debe ser una imagen .jpg o .png";
    }

    if(values.fotografia.size > FILE_SIZE){
      errors.fotografia = "Debe ser menor de 3MB";
    }

    return errors;
  };

  const handleOnSubmit = (values: PlaceFormBiciparqueosProps, actions) => {
    if(user){
      const newBiciparqueo = {
      ...values,
      position: [position.lat, position.lng]
    };
    console.log(newBiciparqueo);    // objeto a subir a backend
    console.log(values.fotografia); // objeto de la imagen subida
    uploadPhotoAndData(newBiciparqueo);
    addNewPlace(newBiciparqueo);
    actions.resetForm({});
    fotoRef.current.value = null;
    closeForm();
    alert('Punto enviado correctamente');
    }else{
      alert("Necesitar iniciar sesión para subir datos.");
    }
    
  }
  const uploadPhotoAndData = (object:any) =>{
    const map = {
      correo_usuario:user.displayName,
      nombre_usuario:user.email,
      uid:user.uid
    };
    //Subir la imagen a Storage para obtener la url de la imagen
    const uploadTask = storageRef.ref(`imagenesBiciparqueos/${ new Date().getTime() +"_"+object.fotografia.name}`)
    .put(object.fotografia).then(data=>{
      data.ref.getDownloadURL().then(url=>{
         //Despues, Formatear la estructura del objeto con la url obtenida de la imagen
         let biciparqueoFormated = formaterBiciparqueo(object,url);
         //Subir datos a Firestore
         db.collection("biciparqueos").doc(biciparqueoFormated.id).set(biciparqueoFormated).then(nada =>{
            db.collection("conf").doc(biciparqueoFormated.id2).set(map)
           })
      })
    })
  }
const formaterBiciparqueo = (bici:any,urlImage:string) =>{
  let idBici = db.collection("biciparqueos").doc().id;
  let data = {
    id:idBici,
    accesibilidad:bici.accesibilidad,
    senalizacion:bici.senalizacion,
    fotografia: urlImage,
    latitud:bici.position[0],
    timestamp:new Date(),
    seguridad_percibida:bici.seguridadPercibida,
    longitud: bici.position[1],
    id2:db.collection("conf").doc().id
  };
  return data;
}
  return (
    <div
      className={`form__container form__container--${isVisible && "active"}`}
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
                <label htmlFor="accesibilidad">Accesibilidad</label>
                <Field id="accesibilidad" name="accesibilidad" as="select" >
                  <option hidden >Selecciona una opción</option>
                  <option value="Público">Público</option>
                  <option value="Privado">Privado</option>
                </Field>
              </div>
              <div className="errors">{errors.accesibilidad}</div>
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="senalizacion">Señalización</label>
                <Field id="senalizacion" name="senalizacion" as="select" >
                  <option hidden >Selecciona una opción</option>
                  <option value="Cuenta">Cuenta</option>
                  <option value="No cuenta">No cuenta</option>
                </Field>
              </div>
               <div className="errors">{errors.senalizacion}</div>
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="seguridadPercibida">Seguridad percibida</label>
                <Field id="seguridadPercibida" name="seguridadPercibida" as="select">
                  <option hidden >Selecciona una opción</option>
                  <option value="Seguro">Seguro</option>
                  <option value="No seguro">No seguro</option>
                </Field>
              </div>
               <div className="errors">{errors.seguridadPercibida}</div>
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="fotografia">Fotografía</label>
                <input id="fotografia" name="fotografia" type="file"  className="form-control" onChange={(event) => {
  setFieldValue("fotografia", event.currentTarget.files![0]);
}} ref={fotoRef}/>
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

interface PlaceFormBiciparqueosProps {
  [key: string]: string;
  tipo: string;
  accesibilidad: string;
  senalizacion: string;
  seguridadPercibida: string;
  fotografia?: any;
}
