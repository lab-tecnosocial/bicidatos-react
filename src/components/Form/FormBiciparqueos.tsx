import { connect } from "react-redux";
import { addNewPlace as addNewPlaceAction, setPlaceFormVisibility } from "../../store/actions";
import { Place, PlaceBiciparqueos } from "../../store/models";
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
    tipo: "biciparqueos",
    accesibilidad: "",
    senalizacion: "",
    seguridadPercibida: "",
    fotografia: ""
  };

  const validator = (values: PlaceFormBiciparqueosProps) => {
    const keys = Object.keys(values);

    return keys.reduce((prev, curr) => {
      if (!values[curr]) {
        return { ...prev, [curr]: "required" };
      }
      return prev;
    }, {});
  };

  const handleOnSubmit = (values: PlaceFormBiciparqueosProps) => {
    addNewPlace({
      ...values,
      position: [position.lat, position.lng]
    });
    closeForm();
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
              {errors.accesibilidad && <div className="errors">Obligatoria</div>}
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
              {errors.senalizacion && <div className="errors">Obligatoria</div>}
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
              {errors.seguridadPercibida && <div className="errors">Obligatoria</div>}
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

interface PlaceFormBiciparqueosProps {
  [key: string]: string;
  tipo: string;
  accesibilidad: string;
  senalizacion: string;
  seguridadPercibida: string;
  fotografia: any;
}
