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
import { useEffect } from "react";


const Preview = ({ isVisible, place, closePreview, closeForm }: any) => {

  const [index, setIndex] = useState(0);
  const [actualizar, setActualizar] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [place]);

  const handleActualizar = () => setActualizar(prevActualizar => !prevActualizar);
  const incrementIndex = () => setIndex(prevIndex => prevIndex + 1);
  const decrementIndex = () => setIndex(prevIndex => prevIndex - 1);

  const ordenarPorFecha = (objeto: any) => {
    let x = Object.keys(objeto.historial).map(key => objeto.historial[key]);

    let y = x.sort((a, b) => {
      let c = new Date(a.timestamp.seconds * 1000);
      let d = new Date(b.timestamp.seconds * 1000);
      return d.valueOf() - c.valueOf();
    });

    return y;
  }

  if (place != null) {
    var primerObjeto = index === 0;
    var ultimoObjeto = index === Object.keys(place.historial).length - 1;
    var largoObjeto = Object.keys(place.historial).length;
    var puntos = [...Array(largoObjeto)].map(number =>
      <li key={number}>&bull;&nbsp;</li>
    )
    // console.log('id del lugar: ', place.id);
    var arregloOrd = ordenarPorFecha(place);
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
      {
        (arregloOrd && arregloOrd[index]?.fotografia &&
          <div
            className="preview__picture"
            style={{ backgroundImage: `url(${arregloOrd[index]?.fotografia})` }}
          ></div>)

        ||

        (arregloOrd && arregloOrd[index].fecha_incidente &&
          <div
            className="preview__picture"
            style={{ backgroundImage: `url(https://bicidatos.org/wp-content/uploads/2021/04/seguridad_cuadrado.png)` }}
          ></div>)

        ||

        (arregloOrd && arregloOrd[index].fecha_observacion &&
          <div
            className="preview__picture"
            style={{ backgroundImage: `url(https://bicidatos.org/wp-content/uploads/2021/04/aforo_cuadrado.png)` }}
          ></div>)

      }

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
        {arregloOrd && arregloOrd[index].accesibilidad && <div className=""><b>Accesibilidad:</b> {arregloOrd[index].accesibilidad}</div>}
        {arregloOrd && arregloOrd[index].senalizacion && <div className=""><b>Señalización:</b> {arregloOrd[index].senalizacion}</div>}
        {arregloOrd && arregloOrd[index].seguridad_percibida && <div className=""><b>Seguridad percibida:</b> {arregloOrd[index].seguridad_percibida}</div>}

        {arregloOrd && arregloOrd[index].nombre && <div className=""><b>Nombre:</b> {arregloOrd[index].nombre}</div>}
        {arregloOrd && arregloOrd[index].tipo && <div className=""><b>Tipo de servicio:</b> {arregloOrd[index].tipo}</div>}
        {arregloOrd && arregloOrd[index].sitioweb && <div className=""><b>Sitio web:</b> <a href={arregloOrd[index].sitioweb} target="_blank">{arregloOrd[index].sitioweb}</a></div>}
        {arregloOrd && arregloOrd[index].telefono && <div className=""><b>Telefono:</b> {arregloOrd[index].telefono}</div>}

        {arregloOrd && arregloOrd[index].fecha_incidente && <div className=""><b>Fecha:</b> {arregloOrd[index].fecha_incidente}</div>}
        {arregloOrd && arregloOrd[index].tipo_incidente && <div className=""><b>Tipo de incidente:</b> {arregloOrd[index].tipo_incidente}</div>}
        {arregloOrd && arregloOrd[index].enlace && <div className=""><b>Enlace:</b> <a href={arregloOrd[index].enlace} target="_blank">{arregloOrd[index].enlace}</a></div>}

        {arregloOrd && arregloOrd[index].fecha_observacion && <div className=""><b>Fecha:</b> {arregloOrd[index].fecha_observacion}</div>}
        {arregloOrd && arregloOrd[index].hora_inicio_observacion && <div className=""><b>Tiempo de inicio:</b> {arregloOrd[index].hora_inicio_observacion}</div>}
        {arregloOrd && arregloOrd[index].hora_fin_observacion && <div className=""><b>Tiempo de fin:</b> {arregloOrd[index].hora_fin_observacion}</div>}
        {arregloOrd && arregloOrd[index].nro_ciclistas_observados && <div className=""><b>Número de ciclistas:</b> {arregloOrd[index].nro_ciclistas_observados}</div>}

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
