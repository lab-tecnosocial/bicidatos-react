import { useState } from 'react';
import { connect } from "react-redux";
import { setPlaceFormVisibility } from "../../store/actions";
import { AiFillCloseCircle } from "react-icons/ai";
import "./Form.css";
import FormBiciparqueos from "./FormBiciparqueos";
import FormServicios from "./FormServicios";
import FormDenuncias from "./FormDenuncias";
import FormAforos from "./FormAforos";




const Form = ({
  isVisible,
  closeForm,
}: {
  isVisible: boolean;
  closeForm: Function;
}) => {

 
  const [selectedForm, setSelectedForm] = useState('');

  const handleChange = (e: any) => {
    setSelectedForm(e.target.value);
  };


  return (
    <div
      className={`form__container form__container--${isVisible && "active"}`}
    >
      <div className="form__header">
        <span
          className="form__header__close"
          role="button"
          onClick={() => closeForm()}
        >
          <AiFillCloseCircle />
        </span>
        <span className="form__header__title">Añadir punto</span>
      </div>
     
        <form>
            <div className="formGroup">
              <div className="formGroupInput">
                <label htmlFor="selectForm">Tipo de reporte</label>
                <select id="selectForm" name="selectForm" onChange={handleChange}>
                  <option hidden >Selecciona una opción</option>
                  <option value="biciparqueos">Biciparqueos</option>
                  <option value="servicios">Servicios</option>
                  <option value="denuncias">Denuncias</option>
                  <option value="aforos">Aforos</option>
                </select>
              </div>
            </div>
            </form>
     
      { selectedForm === 'biciparqueos' && <FormBiciparqueos /> }
      { selectedForm === 'servicios' && <FormServicios /> }
      { selectedForm === 'denuncias' && <FormDenuncias /> }
      { selectedForm === 'aforos' && <FormAforos /> }
    </div>

  );
};

const mapStateToProps = (state: any) => {
  const { places } = state;
  return {
    isVisible: places.placeFormIsVisible,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    closeForm: () =>
      dispatch(setPlaceFormVisibility(false))
    }
  };

export default connect(mapStateToProps, mapDispatchToProps)(Form);