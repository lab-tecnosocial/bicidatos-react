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

  const validator = (values: PlaceFormServiciosProps) => {
    const keys = Object.keys(values);

    return keys.reduce((prev, curr) => {
      if (!values[curr]) {
        return { ...prev, [curr]: "required" };
      }
      return prev;
    }, {});
  };

  const handleOnSubmit = (values: PlaceFormServiciosProps) => {
    addNewPlace({
      ...values,
      position: [position.lat, position.lng]
    });
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
              {errors.nombre && <div className="errors">Obligatoria</div>}
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
              {errors.tipoServicio && <div className="errors">Obligatoria</div>}
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="descripcion">Descripción</label>
                <Field id="descripcion" name="descripcion" />
              </div>
              {errors.descripcion && <div className="errors">Obligatoria</div>}
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="sitioWeb">Sitio web</label>
                <Field id="sitioWeb" name="sitioWeb" />
              </div>
              {errors.sitioWeb && <div className="errors">Obligatoria</div>}
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="telefono">Telefono</label>
                <Field id="telefono" name="telefono" />
              </div>
              {errors.telefono && <div className="errors">Obligatoria</div>}
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="fotografia">Fotografía</label>
                <Field id="fotografia" name="fotografia" placeholder="" />
                {/* <input id="fotografia" name="fotografia" type="file"  className="form-control" /> */}
              </div>
              {errors.fotografia && <div className="errors">Obligatoria</div>}
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
