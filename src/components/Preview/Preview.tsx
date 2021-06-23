import { connect } from "react-redux";
import { setPlacePreviewVisibility } from "../../store/actions";
import { AiFillCloseCircle } from "react-icons/ai";
import "./Preview.css";

const Preview = ({ isVisible, place, closePreview }: any) => {
  return (
    <div
      className={`preview__container preview__container--${
        isVisible && place && "active"
      }`}
    >
      <div className="preview__close" onClick={() => closePreview()}>
        <AiFillCloseCircle></AiFillCloseCircle>
      </div>
      {place?.fotografia && <div
        className="preview__picture"
        style={{ backgroundImage: `url(${place?.fotografia})` }}
      ></div>}
      <div className="preview__description__container">
        {place?.accesibilidad && <div className=""><b>Accesibilidad:</b> {place?.accesibilidad}</div>}  
        {place?.senalizacion && <div className=""><b>Señalización:</b> {place?.senalizacion}</div>}
        {place?.seguridad_percibida && <div className=""><b>Seguridad percibida:</b> {place?.seguridad_percibida}</div>}

        {place?.nombre && <div className=""><b>Nombre:</b> {place?.nombre}</div>}
        {place?.tipo && <div className=""><b>Tipo de servicio:</b> {place?.tipo}</div>}
        {place?.sitioweb && <div className=""><b>Sitio web:</b> {place?.sitioweb}</div>}
        {place?.telefono && <div className=""><b>Telefono:</b> {place?.telefono}</div>}
        
        {place?.fecha_incidente && <div className=""><b>Fecha:</b> {place?.fecha_incidente}</div>}
        {place?.tipo_incidente && <div className=""><b>Tipo de incidente:</b> {place?.tipo_incidente}</div>}
        {place?.enlace && <div className=""><b>Enlace:</b> {place?.enlace}</div>}
        
        {place?.fecha_observacion && <div className=""><b>Fecha:</b> {place?.fecha_observacion}</div>}
        {place?.hora_inicio_observacion && <div className=""><b>Tiempo de inicio:</b> {place?.hora_inicio_observacion}</div>}
        {place?.hora_fin_observacion && <div className=""><b>Tiempo de fin:</b> {place?.hora_fin_observacion}</div>}
        {place?.nro_ciclistas_observados && <div className=""><b>Número de ciclistas:</b> {place?.nro_ciclistas_observados}</div>}

      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  const { places } = state;
  return { isVisible: places.placePreviewsIsVisible, place: places.selectedPlace };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    closePreview: () =>
      dispatch(setPlacePreviewVisibility(false)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
