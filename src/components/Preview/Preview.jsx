import { useStore } from "../../store/context";
import { useState } from "react";
import FormBiciparqueos from "../Form/FormBiciparqueos";
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
import { Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
const Preview = () => {
  const [index, setIndex] = useState(0);
  const [actualizar, setActualizar] = useState(false);
  const { state, dispatch } = useStore();

  const isVisible = state.placePreviewsIsVisible;
  const place = state.selectedPlace;
  const closePreview = () => dispatch({ type: 'SET_PLACE_PREVIEW_VISIBILITY', payload: false });
  const closeForm = () => dispatch({ type: 'SET_PLACE_FORM_VISIBILITY', payload: false });

  useEffect(() => {
    setIndex(0);
    if (place) {
      closeForm();
    }
  }, [place]);

  const handleActualizar = () => setActualizar(prevActualizar => !prevActualizar);
  const incrementIndex = () => setIndex(prevIndex => prevIndex + 1);
  const decrementIndex = () => setIndex(prevIndex => prevIndex - 1);

  const ordenarPorFecha = (objeto) => {
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
  }



  return (
    <div
      className={`preview__container preview__container--${isVisible && place && "active"
        }`}

    >
      <div className="preview__close" onClick={closePreview}>
        <CloseIcon />
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
            style={{ backgroundImage: `url(/img/placeholderDenuncia.png)` }}
          ></div>)

        ||

        (arregloOrd && arregloOrd[index].fecha_observacion &&
          <div
            className="preview__picture"
            style={{ backgroundImage: `url(/img/placeholderAforo.png)` }}
          ></div>)

      }

      <div className="preview__content">
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
          {arregloOrd && arregloOrd[index].sitioweb && <div className=""><b>Sitio web:</b> <a href={arregloOrd[index].sitioweb} target="_blank" rel="noreferrer">{arregloOrd[index].sitioweb.slice(0, 47)}...</a></div>}
          {arregloOrd && arregloOrd[index].telefono && <div className=""><b>Telefono:</b> {arregloOrd[index].telefono}</div>}

          {arregloOrd && arregloOrd[index].fecha_incidente && <div className=""><b>Fecha:</b> {arregloOrd[index].fecha_incidente}</div>}
          {arregloOrd && arregloOrd[index].tipo_incidente && <div className=""><b>Tipo de incidente:</b> {arregloOrd[index].tipo_incidente}</div>}
          {arregloOrd && arregloOrd[index].enlace && <div className=""><b>Enlace:</b> <a href={arregloOrd[index].enlace} target="_blank" rel="noreferrer">{arregloOrd[index].enlace.slice(0, 47)}...</a></div>}

          {arregloOrd && arregloOrd[index].fecha_observacion && <div className=""><b>Fecha:</b> {arregloOrd[index].fecha_observacion}</div>}
          {arregloOrd && arregloOrd[index].hora_inicio_observacion && <div className=""><b>Tiempo de inicio:</b> {arregloOrd[index].hora_inicio_observacion}</div>}
          {arregloOrd && arregloOrd[index].hora_fin_observacion && <div className=""><b>Tiempo de fin:</b> {arregloOrd[index].hora_fin_observacion}</div>}
          {arregloOrd && arregloOrd[index].nro_ciclistas_observados && <div className=""><b>Número de ciclistas:</b> {arregloOrd[index].nro_ciclistas_observados}</div>}

        </div>

        <div className="seccion-notificar-actualizar">
          <FormNotificacion />
          <Tooltip title="Actualizar" arrow>
            <IconButton type="button" onClick={handleActualizar}>
              <UpdateIcon />
            </IconButton>
          </Tooltip>

        </div>

        {actualizar && place?.historial[Object.keys(place?.historial)[index]].accesibilidad && <FormBiciparqueos />}
        {actualizar && place?.historial[Object.keys(place?.historial)[index]].nombre && <FormServicios />}
        {actualizar && place?.historial[Object.keys(place?.historial)[index]].fecha_observacion && <FormAforos />}
        {actualizar && place?.historial[Object.keys(place?.historial)[index]].tipo_incidente && <FormDenuncias />}

        <div style={{ display: "none", zIndex: "1", position: "fixed", right: "0", top: "0", width: "720px", height: "442px", fontFamily: "Poppins" }}>
          {/* <img src={imagen} alt="Imagen de la tarjeta" width={600} height={350} /> */}
          <div style={{ display: "flex", alignItems: "center", flexDirection: "column", width: "100%" }}>

            {/* title banner */}
            <div style={{ padding: "10px 60px", margin: "50px 20px 20px", width: "60%", height: "53px", backgroundColor: "#15c0ea", borderRadius: "50px", display: "flex", alignItems: "center" }}>
              <h1 style={{ color: "white", paddingLeft: "20px", fontSize: "25px" }}>
                {arregloOrd && arregloOrd[index].accesibilidad && "Biciparqueos en Bolivia"}
                {arregloOrd && arregloOrd[index].nombre && "Servicio ciclista en Bolivia"}
                {arregloOrd && arregloOrd[index].fecha_incidente && "Denuncia ciclista en Bolivia"}
                {arregloOrd && arregloOrd[index].fecha_observacion && "Aforo ciclista en Bolivia"}
              </h1>
            </div>

          </div>
          {/* box description */}
          <div style={{ display: "flex", flexDirection: "column", width: "90%", marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ padding: "5px" }}>
              {/* biciparqueo */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                <div>
                  {arregloOrd && arregloOrd[index].accesibilidad && <div className="" style={{ marginTop: "15px" }}><span className="propiedad-style">Accesibilidad:</span> <span className="valor-style">{arregloOrd[index].accesibilidad} </span> </div>}
                  {arregloOrd && arregloOrd[index].senalizacion && <div className="" style={{ marginTop: "15px" }}><span className="propiedad-style">Señalización:</span> <span className="valor-style">{arregloOrd[index].senalizacion}</span></div>}
                  {arregloOrd && arregloOrd[index].seguridad_percibida && <div className="" style={{ marginTop: "15px" }}><span className="propiedad-style">Seguridad percibida:</span> <span className="valor-style">{arregloOrd[index].seguridad_percibida}</span></div>}
                </div>
              </div>

              {/* servicios */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                <div>
                  {arregloOrd && arregloOrd[index].nombre && <div className="" style={{ marginTop: "15px" }}><span className="propiedad-style">Nombre:</span> <span className="valor-style">{arregloOrd[index].nombre}</span></div>}
                  {arregloOrd && arregloOrd[index].tipo && <div className="" style={{ marginTop: "15px" }}><span className="propiedad-style">Tipo de servicio:</span> <span className="valor-style">{arregloOrd[index].tipo}</span></div>}

                  {arregloOrd && arregloOrd[index].telefono && <div className="" style={{ marginTop: "15px" }}><span className="propiedad-style">Telefono:</span> <span className="valor-style">{arregloOrd[index].telefono}</span></div>}
                  {arregloOrd && arregloOrd[index].sitioweb && <div className="" style={{ marginTop: "15px" }}><span className="propiedad-style">Sitio web:</span> <span className="valor-style"><a href={arregloOrd[index].sitioweb} target="_blank" rel="noreferrer">{arregloOrd[index].sitioweb.slice(0, 47)}...</a></span></div>}
                </div>
              </div>
              {/* Denuncia */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>

                <div>
                  {arregloOrd && arregloOrd[index].fecha_incidente && <div className="" style={{ marginTop: "15px" }}><span className="propiedad-style">Fecha:</span> <span className="valor-style">{arregloOrd[index].fecha_incidente}</span></div>}
                  {arregloOrd && arregloOrd[index].tipo_incidente && <div className="" style={{ marginTop: "15px" }}><span className="propiedad-style">Tipo de incidente:</span> <span className="valor-style">{arregloOrd[index].tipo_incidente}</span></div>}
                </div>
              </div>
              {/* Aforo */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                <div>
                  {arregloOrd && arregloOrd[index].fecha_observacion && <div className="" style={{ marginTop: "8px" }}><span className="propiedad-style">Fecha:</span> <span className="valor-style">{arregloOrd[index].fecha_observacion}</span></div>}
                  {arregloOrd && arregloOrd[index].hora_inicio_observacion && <div className="" style={{ marginTop: "8px" }}><span className="propiedad-style">Tiempo de inicio:</span> <span className="valor-style">{arregloOrd[index].hora_inicio_observacion}</span></div>}
                  {arregloOrd && arregloOrd[index].hora_fin_observacion && <div className="" style={{ marginTop: "8px" }}><span className="propiedad-style">Tiempo de fin:</span> <span className="valor-style">{arregloOrd[index].hora_fin_observacion}</span></div>}
                  {arregloOrd && arregloOrd[index].nro_ciclistas_observados && <div className="" style={{ marginTop: "8px" }}><span className="propiedad-style">Número de ciclistas:</span> <span className="valor-style">{arregloOrd[index].nro_ciclistas_observados}</span></div>}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


export default Preview;
