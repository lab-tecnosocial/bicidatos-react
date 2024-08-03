import { useState } from 'react';
import { useStore } from "../../store/context";
import { AiFillCloseCircle } from "react-icons/ai";
import "./Form.css";
import FormBiciparqueos from "./FormBiciparqueos";
import FormServicios from "./FormServicios";
import FormDenuncias from "./FormDenuncias";
import FormAforos from "./FormAforos";
import { useNavigate } from 'react-router-dom';


const Form = () => {
  const [selectedForm, setSelectedForm] = useState('');
  const { state, dispatch } = useStore();

  const isVisible = state.placeFormIsVisible;
  const closeForm = () => dispatch({ type: "SET_PLACE_FORM_VISIBILITY", payload: false });

  const handleChange = (e) => {
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

      {selectedForm === 'biciparqueos' && <FormBiciparqueos />}
      {selectedForm === 'servicios' && <FormServicios />}
      {selectedForm === 'denuncias' && <FormDenuncias />}
      {selectedForm === 'aforos' && <FormAforos />}
    </div>

  );
};



export default Form;