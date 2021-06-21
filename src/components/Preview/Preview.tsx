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
        {place?.seguridadPercibida && <div className=""><b>Seguridad percibida:</b> {place?.seguridadPercibida}</div>}

        {place?.nombre && <div className=""><b>Nombre:</b> {place?.nombre}</div>}
        {place?.tipoServicio && <div className=""><b>Tipo de servicio:</b> {place?.tipoServicio}</div>}
        {place?.sitioWeb && <div className=""><b>Sitio web:</b> {place?.sitioWeb}</div>}
        {place?.telefono && <div className=""><b>Telefono:</b> {place?.telefono}</div>}
        
        {place?.fecha && <div className=""><b>Fecha:</b> {place?.fecha}</div>}
        {place?.tipoIncidente && <div className=""><b>Tipo de incidente:</b> {place?.tipoIncidente}</div>}
        {place?.enlace && <div className=""><b>Enlace:</b> {place?.enlace}</div>}
        
        {place?.fecha && <div className=""><b>Fecha:</b> {place?.fecha}</div>}
        {place?.tiempoInicio && <div className=""><b>Tiempo de inicio:</b> {place?.tiempoInicio}</div>}
        {place?.tiempoFin && <div className=""><b>Tiempo de fin:</b> {place?.tiempoFin}</div>}
        {place?.numCiclistas && <div className=""><b>Número de ciclistas:</b> {place?.numCiclistas}</div>}

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
