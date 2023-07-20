import { LatLngExpression } from "leaflet";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import math from "mathjs";
import mathp from "mathp";
import RecenterAutomatically from "./RecenterAutomatically";

import { makeStyles } from "@material-ui/core/styles";

import "./Recorrido.css";
import db from "../../database/firebase";
import Cronometro from "../Cronometro/Cronometro";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NoSleep from "nosleep.js";
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from "@material-ui/icons/Save";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";

let estadoSumarTotal = false;
let datos = [];

let latitud_2 = 0;
let longitud_2 = 0;
const Recorrido = (props) => {
  const user = useSelector((state: any) => {
    return state.userReducer.user;
  });
  let [time, setTime] = useState(0);
  let [isRunning, setIsRunning] = useState(false);

  let [distanciaRecorrida, setDistanciaRecorrida] = useState(0);

  let longitud1 = 0;
  let longitud2 = 0;
  let latitud1 = 0;
  let latitud2 = 0;
  let total = 0;

  let latitud = 0;
  let longitud = 0;
  function inicializarPuntos() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        longitud1 = position.coords.longitude;
        longitud2 = position.coords.longitude;
        latitud1 = position.coords.latitude;
        latitud2 = position.coords.latitude;

        longitud = position.coords.longitude;
        longitud_2 = position.coords.longitude;
        latitud = position.coords.latitude;
        latitud_2 = position.coords.latitude;
        setPosicionActual([
          position.coords.latitude,
          position.coords.longitude,
        ]);
        guardarPuntos();
        recorrido();
      },
      (error) => { },
      { enableHighAccuracy: true }
    );
  }

  const [isWaiting, setIsWaiting] = useState(false);
  const [acumular, setAcumular] = useState(false);
  useEffect(() => {
    setAcumular(false);
    datos = [];
  }, []);
  useEffect(() => {
    if (isWaiting) {
      const timeoutId = setTimeout(() => {
        setIsWaiting(false);
      }, 4000);

      return () => clearTimeout(timeoutId);
    }
  }, [isWaiting]);

  useEffect(() => {
    if (!isWaiting) {
      if (acumular) {
        navigator.geolocation.getCurrentPosition((position) => {
          latitud = position.coords.latitude;
          longitud = position.coords.longitude;
          console.log("lat2 " + (latitud_2 == 0));
          console.log("lon2" + (longitud_2 == 0));
          latitud_2 = latitud_2 == 0 ? latitud : latitud_2;
          longitud_2 = longitud_2 == 0 ? longitud : longitud_2;
          console.log("lat1 " + latitud);
          console.log("lon1" + longitud);

          console.log(
            "calcularDistancia" +
            calcularDistanciaDosPuntos(
              latitud_2,
              longitud_2,
              latitud,
              longitud
            )
          );
          if (
            calcularDistanciaDosPuntos(
              latitud_2,
              longitud_2,
              latitud,
              longitud
            ) > 0
          ) {
            datos.push([longitud, latitud]);
          }
          latitud_2 = latitud;
          longitud_2 = longitud;
        });
      }
      console.log(datos);
      setIsWaiting(true);
    }
  }, [isWaiting]);
  const guardarPuntos = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      latitud_2 = position.coords.latitude;
      longitud_2 = position.coords.longitude;
      console.log(
        "calcularDistancia" +
        calcularDistanciaDosPuntos(latitud_2, longitud_2, latitud, longitud)
      );

      if (
        calcularDistanciaDosPuntos(latitud_2, longitud_2, latitud, longitud) > 0
      ) {
        datos.push([longitud, latitud]);
      }
      latitud = latitud_2;
      longitud = longitud_2;
    });
    setTimeout(guardarPuntos, 4000);
  };

  //------------------------------------------------------------------------------------------------------------------------------------------

  const recorrido = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // console.log("recorrido")
        setPosicionActual([
          position.coords.latitude,
          position.coords.longitude,
        ]);
        //setPunto2([position.coords.latitude, position.coords.longitude]);
        latitud2 = position.coords.latitude;
        longitud2 = position.coords.longitude;
        // setPunto2([position.coords.latitude, position.coords.longitude]);
        // console.log(sumarTotal)
        if (estadoSumarTotal) {
          acumularDistancia();
        }
        latitud1 = latitud2;
        longitud1 = longitud2;
        // let latitud2=punto2[0]
        // let longitud2=punto2[1]
        // setPunto1([latitud2, longitud2]);
      },
      (error) => { },
      { enableHighAccuracy: true }
    );
    setTimeout(recorrido, 4000);
  };
  function acumularDistancia() {
    console.log(
      "DISTANCIA ENTRE DOS PUNTOS---------------------------------------------------------------------------------------------------"
    );
    let distancia = calcularDistanciaDosPuntos(
      latitud1,
      longitud1,
      latitud2,
      longitud2
    );
    console.log(distancia);
    if (distancia > 0) {
      total = total + distancia;
      setDistanciaRecorrida(total);
    }
  }
  function calcularDistanciaDosPuntos(
    latitud1,
    longitud1,
    latitud2,
    longitud2
  ) {
    // console.log(
    //   "---------------------------------------------------------------------------"
    // );
    // console.log(latitud1);
    // console.log(longitud1);
    // console.log(latitud2);
    // console.log(longitud2);

    var R = 6371000;

    var R = 6371000;
    var x1 = latitud2 - latitud1;
    var dLat = mathp.toRadians(x1);
    var x2 = longitud2 - longitud1;
    var dLon = mathp.toRadians(x2);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(mathp.toRadians(latitud1)) *
      Math.cos(mathp.toRadians(latitud2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }
  React.useEffect(() => {
    inicializarPuntos();
  }, []);
  const defaultPosition: LatLngExpression = [-17.396, -66.153]; // Cochabamba

  let [posicionActual, setPosicionActual] = useState<LatLngExpression>([
    -17.396,
    -66.153,
  ]);
  let [sumarTotal, setSumarTotal] = useState(false);
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    header: {
      backgroundColor: "#15C0EA",
    },
    button: {
      // width: "200px",
      backgroundColor: "green",
      color: "white",
      padding: "5px 10px",
      marginRight: "10px",
      "&:hover": {
        backgroundColor: "darkgreen",
      },
    },
    buttonRed: {
      backgroundColor: "red",
      "&:hover": {
        backgroundColor: "darkred",
      }
    },
    iconButton: {
      backgroundColor: "white",
      borderRadius: "50%",
      marginRight:"10px",
      "&:hover": {
        backgroundColor: "#e0e0e0",
      },
    },
    saveIcon: {
      color: "#333333",
      fontSize: "30px",
      "&:hover": {
        color: "#999999",
      },
    },

  }));
  const classes = useStyles();
  const handleSumarTotal = () => {
    setAcumular(!acumular);
    setIsRunning(!isRunning);
    console.log("cambiar estado");
    console.log("anterior " + estadoSumarTotal);
    estadoSumarTotal = !estadoSumarTotal;
    setSumarTotal(!sumarTotal);
    console.log("actualizado " + estadoSumarTotal);
  };
  const navigate = useNavigate();

  const handleGuardarInformacion = (e) => {
    setAcumular(false);
    console.log("Guardar informacion");
    const miDocumento = {
      distanciaKilometros: distanciaRecorrida / 1000,
      fecha: new Date(),
      tiempoHoras: time / 3600,
    };
    db.collection("recorridos")
      .where("UIDUsuario", "==", user.uid)
      .get()
      .then((querySnapshot) => {
        console.log("Insertando------------------------------------------------------------------------------------------------------------------------")
        console.log(querySnapshot.docs);
        if (querySnapshot.docs.length != 0) {
          querySnapshot.forEach((doc) => {
            console.log("Insertando documento de recorrido con el id------------------------------------------------------------------------------------------------------------------------")
            console.log(doc.id);
            insertarRecorrido(doc.id, miDocumento);
          });
          navigate("/datos-recorridos");

        }
        else {
          console.log("Insertando nuevo doc recorrido--------------------------------------------------------------------------------------------------------------")
          db.collection("recorridos").add({
            UIDUsuario: user.uid,
          });
          db.collection("recorridos")
            .where("UIDUsuario", "==", user.uid)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                insertarRecorrido(doc.id, miDocumento);
              });
              navigate("/datos-recorridos");

            });
        }
      })
      .catch((error) => {

      });

    // document
    //   .getElementById("guardar_distancia")
    //   .setAttribute("href", "./../DatosPersonales/pagina.html");
    setTime(0);
    setIsRunning(false);
  };
  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    total = 0;
    setDistanciaRecorrida(0);
  };

  function insertarRecorrido(id_documento: string, documento: any) {
    const miColeccionPrincipal = db.collection("recorridos");
    const miSubColeccion = miColeccionPrincipal
      .doc(id_documento)
      .collection("historial");
    documento = {
      ...documento,
      puntosRecorridos: JSON.stringify({
        data: datos,
      }),
    };
    miSubColeccion
      .add(documento)
      .then((docRef) => {
        console.log("Documento registrado con ID:", docRef.id);
      })
      .catch((error) => {
        console.error("Error al registrar el documento:", error);
      });
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  //MANEJO ENCENDIDO CAMBIO SCREEN--------------------------------------------------------------------------------------------------------
  const [isPaginaNormal, setIsPaginaNormal] = useState(true);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOrientationLocked, setIsOrientationLocked] = useState(true);

  //FULL SCREEN----------------------------------------------------------------------------------------------------------------------------------------------------

  const toggleFullscreen = () => {
    console.log(
      "FULL SCREEN INITIAL STATE--------------------------------------------------------" +
      isFullscreen
    );
    setIsFullscreen(!isFullscreen);

    if (!isFullscreen) {
      setIsFullscreen(!isFullscreen);
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    console.log(
      "FULL SCREEN STATE--------------------------------------------------------" +
      isFullscreen
    );
  };

  useEffect(() => {
    const handleOrientationChange = () => {
      const alpha = Math.abs(window.orientation);
      setIsOrientationLocked(alpha !== 0 && alpha !== 180);
    };

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);
  //----------------------------------------------------------------------------------------------------------------------------------------------------

  //DISABLE COMPONENTS----------------------------------------------------------------------------------------------------------------------------------------------------
  const [isTouchDisabled, setIsTouchDisabled] = useState(false);

  const handleTouchStart = (event) => {
    if (isTouchDisabled) {
      event.preventDefault();
    }
  };

  const handleButtonClick = () => {
    setIsTouchDisabled(!isTouchDisabled);
  };
  const handleButtonClick2 = () => {
    alert("Mensaje 2");
  };
  const handleButtonClick3 = () => {
    alert("Mensaje 3");
  };

  const touchEvents = isTouchDisabled
    ? {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchStart,
      onTouchEnd: handleTouchStart,
    }
    : {};

  const touchDisabledStyle = isTouchDisabled
    ? {
      pointerEvents: "none",
    }
    : {};
  //----------------------------------------------------------------------------------------------------------------------------------------------------

  //SLEEP----------------------------------------------------------------------------------------------------------------------------------------------------

  const [noSleep, setNoSleep] = useState(null);
  const [estado, setEstado] = useState(false);
  useEffect(() => {
    const noSleep = new NoSleep();
    setNoSleep(noSleep);
    return () => noSleep.disable();
  }, []);

  const handleLockScreen = () => {
    if (noSleep) {
      if (noSleep.isEnabled) {
        setEstado(false);
        noSleep.disable();
      } else {
        setEstado(true);
        noSleep.enable();
      }
    }
  };
  //----------------------------------------------------------------------------------------------------------------------------------------------------

  const handleState = () => {
    props.setIsSidebarVisible(false);
    handleSumarTotal();
    props.setVerNav(!props.verNav);
    setIsPaginaNormal(!isPaginaNormal);
    toggleFullscreen();
    handleButtonClick();
    handleLockScreen();
  };
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  let interval;

  const handlePresion = () => {
    interval = setTimeout(() => {
      handleState();
    }, 5000);
  };

  const handleTouchEnd = () => {
    clearTimeout(interval);
  };

  const handleMouseDown = () => {
    interval = setTimeout(() => {
      handleState();
    }, 5000);
  };

  const handleMouseUp = () => {
    clearTimeout(interval);
  };

  return (
    <div
      className="total"
      style={{ background: isPaginaNormal ? "white" : "#343537" }}
    >
      <div
        style={{
          width: "100%",
          display: isPaginaNormal ? "flex" : "none",
          minHeight: "100vh",
          textAlign: "center",
          flexDirection: "column",
          fontSize: "0.8rem",
          background: "white",
        }}
      >
        <MapContainer
          center={posicionActual}
          zoom={16}
          scrollWheelZoom={true}
          className="map-view-total-distance"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={posicionActual} />
          <RecenterAutomatically
            lat={posicionActual[0]}
            lng={posicionActual[1]}
          />
        </MapContainer>

        <div className="data-container">
          <p>{distanciaRecorrida.toFixed(2)} metros</p>
          <div className="btn-container">
            <IconButton
              className={classes.iconButton}
              // variant="contained"
              onClick={handleState}
              aria-label={sumarTotal ? "Pausar" : "Encender"}
            >
              {sumarTotal ? <PauseIcon style={{ color: "gray", fontSize: "28px" }} /> : <PlayArrowIcon style={{ color: "#32bea6", fontSize: "28px" }} />}
            </IconButton>

            <IconButton
              // style={{ backgroundColor: "white", borderRadius: "50%" }}
              color="default"
              aria-label="Save"
              onClick={handleGuardarInformacion}
              className={classes.iconButton}
            >
              <SaveIcon style={{ color: "#333333", fontSize:"30px" }} />
            </IconButton>
          </div>
          <Cronometro
            time={time}
            setTime={setTime}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
          />
        </div>
      </div>

      <div
        id="registrando-recorrido"
        style={{
          width: "100%",
          justifyContent: "center",
          height: "80%",
          background: "#15c0ea",
          display: isPaginaNormal ? "none" : "flex",
          flexDirection: "column",
          pointerEvents: isTouchDisabled ? "none" : "auto",
        }}
        {...touchEvents}
      >
        <h1>REGISTRANDO TU RECORRIDO</h1>
        <div className="imagen_registrando">
          <img
            src="profile-picture.jpg"
            alt="Foto de perfil"
            srcSet="https://media.tenor.com/l4PZ23-_tSgAAAAi/cycling-matters-cycling.gif"
          />
        </div>
      </div>
      <div
        id="boton-cambio-estado"
        style={{
          paddingBottom: "5px",
          height: "20%",
          display: isPaginaNormal ? "none" : "flex",
        }}
      >
        <p>Mantener presionado para pausar</p>
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handlePresion}
          onTouchEnd={handleTouchEnd}
          style={{ height: "40px" }}
        >
          {isFullscreen ? "Pausar" : ""}
        </button>
      </div>
    </div>
  );
};

export default Recorrido;
