import { connect } from "react-redux";
import { addNewPlace as addNewPlaceAction, setPlaceFormVisibility } from "../../store/actions";
import { Place, PlaceAforos } from "../../store/models";
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
    tipo: "aforos",
    fecha: "",
    tiempoInicio: "",
    tiempoFin: "",
    numCiclistas: "",
    numMujeres: "",
    numHombres: ""
  };

  const validator = (values: PlaceFormAforosProps) => {
    const keys = Object.keys(values);

    return keys.reduce((prev, curr) => {
      if (!values[curr]) {
        return { ...prev, [curr]: "required" };
      }
      return prev;
    }, {});
  };

  const handleOnSubmit = (values: PlaceFormAforosProps) => {
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
                <label htmlFor="fecha">Fecha</label>
                <Field id="fecha" name="fecha" />
              </div>
              {errors.fecha && <div className="errors">Obligatoria</div>}
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="tiempoInicio">Tiempo de inicio</label>
                <Field id="tiempoInicio" name="tiempoInicio" />
              </div>
              {errors.tiempoInicio && <div className="errors">Obligatoria</div>}
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="tiempoFin">Tiempo de fin</label>
                <Field id="tiempoFin" name="tiempoFin" />
              </div>
              {errors.tiempoFin && <div className="errors">Obligatoria</div>}
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="numCiclistas">Número de ciclistas observados</label>
                <Field id="numCiclistas" name="numCiclistas" />
              </div>
              {errors.numCiclistas && <div className="errors">Obligatoria</div>}
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="numMujeres">Número de mujeres</label>
                <Field id="numMujeres" name="numMujeres" />
              </div>
              {errors.numCiclistas && <div className="errors">Obligatoria</div>}
            </div>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="numHombres">Número de hombres</label>
                <Field id="numHombres" name="numHombres" />
              </div>
              {errors.numCiclistas && <div className="errors">Obligatoria</div>}
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
