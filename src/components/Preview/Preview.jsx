import { connect } from "react-redux";
import { useRef, useState } from "react";
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
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import FormDenuncias from "../Form/FormDenuncias";
import { useEffect } from "react";
import domtoimage from 'dom-to-image';
import html2canvas from 'html2canvas';
import imagen from './imagen.png';
import biciparqueoImagen from './location-parqueo.png';
import servicioImagen from './location-taller.png';
import denunciaImagen from './location-seguridad.png';
import bicidatosImagen from './bicidatos_bolivia.png';
import aforoImagen from './location-aforos.png';
import QrGenerator from "./QrGenerator";
import { Tooltip } from '@material-ui/core';

const Preview = ({ isVisible, place, closePreview, closeForm }) => {
  const cardRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [actualizar, setActualizar] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [place]);

  const handleActualizar = () => setActualizar(prevActualizar => !prevActualizar);
  const handleShare = (e) => {
    e.preventDefault();
    console.log("hola");
    // let node =document.getElementById("preview-service");
    // domtoimage.toJpeg(document.getElementById('contenido-servicio'), { quality: 0.95 })
    // .then(function (dataUrl) {
    //     var link = document.createElement('a');
    //     link.download = 'my-image-name.jpeg';
    //     link.href = dataUrl;
    //     link.click();
    // });
    cardRef.current.style.display = 'block';
    html2canvas(cardRef.current).then((canvas) => {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tarjeta.png';
      a.click();
      cardRef.current.style.display = 'none';
    });
  }
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
          <Tooltip title="Compartir" arrow>
            <IconButton type="button" onClick={handleShare}>
              <ShareOutlinedIcon />
            </IconButton>
          </Tooltip>
        </div>

        {actualizar && place?.historial[Object.keys(place?.historial)[index]].accesibilidad && <FormBiciparqueos />}
        {actualizar && place?.historial[Object.keys(place?.historial)[index]].nombre && <FormServicios />}
        {actualizar && place?.historial[Object.keys(place?.historial)[index]].fecha_observacion && <FormAforos />}
        {actualizar && place?.historial[Object.keys(place?.historial)[index]].tipo_incidente && <FormDenuncias />}

        <div ref={cardRef} style={{ display: "none", zIndex: "1", position: "fixed", right: "0", top: "0", width: "720px", height: "442px", fontFamily: "Poppins", backgroundImage: `url(${imagen})` }}>
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

            {arregloOrd && arregloOrd[index].accesibilidad && <img src={biciparqueoImagen} alt="BiciparqueoImagen" height={150} style={{ position: "absolute", right: "50px", top: "20px" }} />}
            {arregloOrd && arregloOrd[index].nombre && <img src={servicioImagen} alt="ServicioImagen" height={140} style={{ position: "absolute", right: "50px", top: "20px" }} />}
            {arregloOrd && arregloOrd[index].fecha_incidente && <img src={denunciaImagen} alt="DenunciaImagen" height={140} style={{ position: "absolute", right: "50px", top: "20px" }} />}
            {arregloOrd && arregloOrd[index].fecha_observacion && <img src={aforoImagen} alt="DenunciaImagen" height={140} style={{ position: "absolute", right: "50px", top: "20px" }} />}
          </div>
          {/* box description */}
          <div style={{ display: "flex", flexDirection: "column", width: "90%", marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ padding: "5px" }}>
              {/* biciparqueo */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                <div>
                  {arregloOrd && arregloOrd[index].accesibilidad && arregloOrd[index].senalizacion && (
                    <span className="valor-style">
                      <QrGenerator url={`geo:${place?.latitud},${place?.longitud}`} />
                    </span>
                  )}
                </div>
                <div>
                  {arregloOrd && arregloOrd[index].accesibilidad && <div className="" style={{ marginTop: "15px" }}><span className="propiedad-style">Accesibilidad:</span> <span className="valor-style">{arregloOrd[index].accesibilidad} </span> </div>}
                  {arregloOrd && arregloOrd[index].senalizacion && <div className="" style={{ marginTop: "15px" }}><span className="propiedad-style">Señalización:</span> <span className="valor-style">{arregloOrd[index].senalizacion}</span></div>}
                  {arregloOrd && arregloOrd[index].seguridad_percibida && <div className="" style={{ marginTop: "15px" }}><span className="propiedad-style">Seguridad percibida:</span> <span className="valor-style">{arregloOrd[index].seguridad_percibida}</span></div>}
                </div>
              </div>

              {/* servicios */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                <div>
                  {arregloOrd && arregloOrd[index].sitioweb && <div className="" style={{ marginTop: "15px" }}><span className="valor-style"><QrGenerator url={arregloOrd[index].sitioweb} /></span></div>}
                </div>
                <div>
                  {arregloOrd && arregloOrd[index].nombre && <div className="" style={{ marginTop: "15px" }}><span className="propiedad-style">Nombre:</span> <span className="valor-style">{arregloOrd[index].nombre}</span></div>}
                  {arregloOrd && arregloOrd[index].tipo && <div className="" style={{ marginTop: "15px" }}><span className="propiedad-style">Tipo de servicio:</span> <span className="valor-style">{arregloOrd[index].tipo}</span></div>}

                  {arregloOrd && arregloOrd[index].telefono && <div className="" style={{ marginTop: "15px" }}><span className="propiedad-style">Telefono:</span> <span className="valor-style">{arregloOrd[index].telefono}</span></div>}

                </div>
              </div>
              {/* Denuncia */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                <div>
                  {arregloOrd && arregloOrd[index].enlace && (
                    <div className="" style={{ marginTop: "15px" }}>
                      <span className="valor-style">
                        <QrGenerator url={arregloOrd[index].enlace} />
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  {arregloOrd && arregloOrd[index].fecha_incidente && <div className="" style={{ marginTop: "15px" }}><span className="propiedad-style">Fecha:</span> <span className="valor-style">{arregloOrd[index].fecha_incidente}</span></div>}
                  {arregloOrd && arregloOrd[index].tipo_incidente && <div className="" style={{ marginTop: "15px" }}><span className="propiedad-style">Tipo de incidente:</span> <span className="valor-style">{arregloOrd[index].tipo_incidente}</span></div>}
                </div>
              </div>
              {/* Aforo */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                <div>
                  {arregloOrd && arregloOrd[index].fecha_observacion && (
                    <div className="" style={{ marginTop: "15px" }}>
                      <span className="valor-style">
                        <QrGenerator url={`geo:${place?.latitud},${place?.longitud}`} />
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  {arregloOrd && arregloOrd[index].fecha_observacion && <div className="" style={{ marginTop: "8px" }}><span className="propiedad-style">Fecha:</span> <span className="valor-style">{arregloOrd[index].fecha_observacion}</span></div>}
                  {arregloOrd && arregloOrd[index].hora_inicio_observacion && <div className="" style={{ marginTop: "8px" }}><span className="propiedad-style">Tiempo de inicio:</span> <span className="valor-style">{arregloOrd[index].hora_inicio_observacion}</span></div>}
                  {arregloOrd && arregloOrd[index].hora_fin_observacion && <div className="" style={{ marginTop: "8px" }}><span className="propiedad-style">Tiempo de fin:</span> <span className="valor-style">{arregloOrd[index].hora_fin_observacion}</span></div>}
                  {arregloOrd && arregloOrd[index].nro_ciclistas_observados && <div className="" style={{ marginTop: "8px" }}><span className="propiedad-style">Número de ciclistas:</span> <span className="valor-style">{arregloOrd[index].nro_ciclistas_observados}</span></div>}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "end", justifyContent: "space-between", width: "80%", marginLeft: "auto", marginRight: "auto", padding: "0 60px" }}>
            <div style={{ display: "flex", alignItems: "end" }}>
              <p style={{ color: "#15C0EA", fontFamily: "Poppins", fontWeight: "bold", fontSize: "1.5625rem", width: "420px" }}>
                ¡Usa tu bici, pedalea y comienza a subir BiciDatos!</p>
            </div>
            <div style={{ display: "flex", alignItems: "end", marginBottom: "30px" }}>
              <img src={bicidatosImagen} alt="BiciDatosImagen" style={{ display: "block" }} width={120} height={74.88} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const mapStateToProps = (state) => {
  const { places } = state;
  return { isVisible: places.placePreviewsIsVisible, place: places.selectedPlace };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closePreview: () =>
      dispatch(setPlacePreviewVisibility(false)),
    closeForm: () =>
      dispatch(setPlaceFormVisibility(false))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
