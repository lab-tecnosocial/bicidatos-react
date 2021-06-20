import { connect } from "react-redux";
import { addNewPlace as addNewPlaceAction, setPlaceFormVisibility } from "../../store/actions";
import { Place, PlaceDenuncias } from "../../store/models";
import { AiFillCloseCircle } from "react-icons/ai";
import "./Form.css";
import { Field, Formik, Form as FormikForm } from "formik";
import { LatLng } from "leaflet";

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

  const initialValues = {
    tipo: "denuncias",
    fecha: "",
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

  const validator = (values: PlaceFormDenunciasProps) => {
    const errors: any = {};
    if(!values.fecha){
      errors.fecha = "Requerido";
    }
    if(!values.tipoIncidente){
      errors.tipoIncidente = "Requerido";
    }
    if(!values.telefono){
      errors.telefono = "Requerido";
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

  const handleOnSubmit = (values: PlaceFormDenunciasProps) => {
    const newDenuncia = {
      ...values,
      position: [position.lat, position.lng]
    };
    console.log(newDenuncia);       // objeto a subir a backend
    console.log(values.fotografia); // objeto de la imagen subida

    addNewPlace(newDenuncia);
    closeForm()
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
                <label htmlFor="fecha">Fecha del incidente</label>
                <Field id="fecha" name="fecha" />
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
                  <option value="Atropello a ciclistata">Atropello a ciclista</option>
                  <option value="Agresión física<">Agresión física</option>
                  <option value="Agresión verbal">Agresión verbal</option>
                  <option value="Manoseo">Manoseo</option>
                  <option value="Daño a infrestructura ciclista">Daño a infrestructura ciclista</option>
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
  setFieldValue("fotografia", event.currentTarget.files![0]);
}} />
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
