import { connect, useSelector } from "react-redux";
import { useState } from "react";
import FormBiciparqueos from "../Form/FormBiciparqueos";
import { setPlaceFormVisibility, setPlacePreviewVisibility } from "../../store/actions";
import { AiFillCloseCircle } from "react-icons/ai";
import "./Preview.css";
import FormServicios from "../Form/FormServicios";
import FormAforos from "../Form/FormAforos";
import FormNotificacion from "../Form/FormNotificacion";
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import UpdateIcon from '@material-ui/icons/Update';
import FormDenuncias from "../Form/FormDenuncias";


const Preview = ({ isVisible, place, closePreview, closeForm }: any) => {

  const [index, setIndex] = useState(0);
  const [actualizar, setActualizar] = useState(false);

  const handleActualizar = () => setActualizar(prevActualizar => !prevActualizar);
  const incrementIndex = () => setIndex(prevIndex => prevIndex + 1);
  const decrementIndex = () => setIndex(prevIndex => prevIndex - 1);

  if (place != null) {
    var primerObjeto = index === 0;
    var ultimoObjeto = index === Object.keys(place.historial).length - 1;
    var largoObjeto = Object.keys(place.historial).length;
    var puntos = [...Array(largoObjeto)].map(number =>
      <li key={number}>&bull;&nbsp;</li>
    )
    console.log('id del lugar: ', place.id);
    console.log(place);
    closeForm();
  }



  return (
    <div
      className={`preview__container preview__container--${isVisible && place && "active"
        }`}
    >
      <div className="preview__close" onClick={() => closePreview()}>
        <AiFillCloseCircle></AiFillCloseCircle>
      </div>
      {place?.historial[Object.keys(place?.historial)[index]].fotografia && <div
        className="preview__picture"
        style={{ backgroundImage: `url(${place?.historial[Object.keys(place?.historial)[index]].fotografia})` }}
      ></div>}
      <div className="seccion-flechas">
        <IconButton type="button" onClick={decrementIndex} disabled={primerObjeto} >
          <ArrowBackIosIcon />
        </IconButton>
        <ul className="puntos">
          {puntos}
        </ul>
        <IconButton type="button" onClick={incrementIndex} disabled={ultimoObjeto}>
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
      <div className="preview__description__container">
        {place?.historial[Object.keys(place?.historial)[index]].accesibilidad && <div className=""><b>Accesibilidad:</b> {place?.historial[Object.keys(place?.historial)[index]].accesibilidad}</div>}
        {place?.historial[Object.keys(place?.historial)[index]].senalizacion && <div className=""><b>Señalización:</b> {place?.historial[Object.keys(place?.historial)[index]].senalizacion}</div>}
        {place?.historial[Object.keys(place?.historial)[index]].seguridad_percibida && <div className=""><b>Seguridad percibida:</b> {place?.historial[Object.keys(place?.historial)[index]].seguridad_percibida}</div>}

        {place?.historial[Object.keys(place?.historial)[index]].nombre && <div className=""><b>Nombre:</b> {place?.historial[Object.keys(place?.historial)[index]].nombre}</div>}
        {place?.historial[Object.keys(place?.historial)[index]].tipo && <div className=""><b>Tipo de servicio:</b> {place?.historial[Object.keys(place?.historial)[index]].tipo}</div>}
        {place?.historial[Object.keys(place?.historial)[index]].sitioweb && <div className=""><b>Sitio web:</b> <a href={place?.historial[Object.keys(place?.historial)[index]].sitioweb} target="_blank">{place?.historial[Object.keys(place?.historial)[index]].sitioweb}</a></div>}
        {place?.historial[Object.keys(place?.historial)[index]].telefono && <div className=""><b>Telefono:</b> {place?.historial[Object.keys(place?.historial)[index]].telefono}</div>}

        {place?.historial[Object.keys(place?.historial)[index]].fecha_incidente && <div className=""><b>Fecha:</b> {place?.historial[Object.keys(place?.historial)[index]].fecha_incidente}</div>}
        {place?.historial[Object.keys(place?.historial)[index]].tipo_incidente && <div className=""><b>Tipo de incidente:</b> {place?.historial[Object.keys(place?.historial)[index]].tipo_incidente}</div>}
        {place?.historial[Object.keys(place?.historial)[index]].enlace && <div className=""><b>Enlace:</b> {place?.historial[Object.keys(place?.historial)[index]].enlace}</div>}

        {place?.historial[Object.keys(place?.historial)[index]].fecha_observacion && <div className=""><b>Fecha:</b> {place?.historial[Object.keys(place?.historial)[index]].fecha_observacion}</div>}
        {place?.historial[Object.keys(place?.historial)[index]].hora_inicio_observacion && <div className=""><b>Tiempo de inicio:</b> {place?.historial[Object.keys(place?.historial)[index]].hora_inicio_observacion}</div>}
        {place?.historial[Object.keys(place?.historial)[index]].hora_fin_observacion && <div className=""><b>Tiempo de fin:</b> {place?.historial[Object.keys(place?.historial)[index]].hora_fin_observacion}</div>}
        {place?.historial[Object.keys(place?.historial)[index]].nro_ciclistas_observados && <div className=""><b>Número de ciclistas:</b> {place?.historial[Object.keys(place?.historial)[index]].nro_ciclistas_observados}</div>}

      </div>

      <div className="seccion-notificar-actualizar">
        <FormNotificacion />
        <IconButton type="button" onClick={handleActualizar}>
          <UpdateIcon />
        </IconButton>
      </div>

      {actualizar && place?.historial[Object.keys(place?.historial)[index]].accesibilidad && <FormBiciparqueos />}
      {actualizar && place?.historial[Object.keys(place?.historial)[index]].nombre && <FormServicios />}
      {actualizar && place?.historial[Object.keys(place?.historial)[index]].fecha_observacion && <FormAforos />}
      {actualizar && place?.historial[Object.keys(place?.historial)[index]].tipo_incidente && <FormDenuncias />}

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
    closeForm: () =>
      dispatch(setPlaceFormVisibility(false))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
