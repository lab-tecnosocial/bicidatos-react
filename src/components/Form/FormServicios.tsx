import { connect } from "react-redux";
import { addNewPlace as addNewPlaceAction, setPlaceFormVisibility } from "../../store/actions";
import { Place, PlaceServicios } from "../../store/models";
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

  const validator = (values: PlaceFormServiciosProps) => {
    const errors: any = {};
    if(!values.nombre){
      errors.nombre = "Requerido";
    }
    if(!values.tipoServicio){
      errors.tipoServicio = "Requerido";
    }
    if(!values.telefono){
      errors.telefono = "Requerido";
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

  const handleOnSubmit = (values: PlaceFormServiciosProps) => {
    const newServicio = {
      ...values,
      position: [position.lat, position.lng]
    };
    console.log(newServicio);       // objeto a subir a backend
    console.log(values.fotografia); // objeto de la imagen subida
    addNewPlace(newServicio);
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
                <Field id="descripcion" name="descripcion" />
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
                <Field id="telefono" name="telefono" />
              </div>
              <div className="errors">{errors.telefono}</div>
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="fotografia">Fotografía</label>
                <input id="fotografia" name="fotografia" type="file"  className="form-control" onChange={(event) => {
  setFieldValue("fotografia", event.currentTarget.files![0]);
}} />
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
