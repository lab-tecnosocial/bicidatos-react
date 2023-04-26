// import React, { useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
// import { LatLng, LatLngBounds } from "leaflet";

// const Recorrido= () => {
//   const [position, setPosition] = React.useState<LatLng>();
//   const [prueba, setPrueba] = React.useState<LatLng>();

//   const [bounds, setBounds] = React.useState<LatLngBounds>();
//   const [startPosition, setStartPosition] = React.useState<LatLng>(
//   );
//   const [endPosition, setEndPosition] = React.useState<LatLng>(
//   );
//   const [markers, setMarkers] = React.useState<LatLng[]>([]);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         console.log(position);
//         setPosition(
//           new LatLng(position.coords.latitude, position.coords.longitude)
//         );
//         setMarkers((oldMarkers) =>
//           oldMarkers.concat([
//             new LatLng(position.coords.latitude, position.coords.longitude),
//           ])
//         );
//       },
//       () => {},
//       { enableHighAccuracy: true, timeout: 1 }
//     );
//   }, []);

//   useEffect(() => {
//     if (markers.length > 2) {
//       const startPosition = markers[0];
//       const endPosition = markers[markers.length - 1];
//       setStartPosition(startPosition);
//       setEndPosition(endPosition);
//       const bounds = new LatLngBounds(startPosition, endPosition);
//       setBounds(bounds);
//     }
//   }, [markers]);

//   return (
//     <MapContainer
//       center={position || [0, 0]}
//       bounds={bounds}
//       zoom={14}
//       style={{ height: "400px", width: "400px" }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//       />

//       {startPosition && (
//         <Marker position={startPosition}>
//           <span>Start</span>
//         </Marker>
//       )}

//       {endPosition && (
//         <Marker position={endPosition}>
//           <span>End</span>
//         </Marker>
//       )}

//       {markers.length > 1 && <Polyline positions={markers} />}
//     </MapContainer>
//   );
// };

// export default Recorrido;

//--------------------------------------------------------------------------------------------------

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

let estadoSumarTotal = false;
let datos = [];

const Recorrido = (props) => {
  const user = useSelector((state: any) => {
    return state.userReducer.user;
  });
  let [time, setTime] = useState(0);
  let [isRunning, setIsRunning] = useState(false);

  let [distanciaRecorrida, setDistanciaRecorrida] = useState(0);
  // let [punto1, setPunto1] = useState([0, 0]);
  // let [punto2, setPunto2] = useState([0, 0]);

  let longitud1 = 0;
  let longitud2 = 0;
  let latitud1 = 0;
  let latitud2 = 0;
  let total = 0;
  function inicializarPuntos() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        longitud1 = position.coords.longitude;
        longitud2 = position.coords.longitude;
        latitud1 = position.coords.latitude;
        latitud2 = position.coords.latitude;
        setPosicionActual([
          position.coords.latitude,
          position.coords.longitude,
        ]);

        recorrido();
        // setPunto1([position.coords.latitude, position.coords.longitude]);

        // setPunto2([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {},
      { enableHighAccuracy: true }
    );
  }
  // Función que actualiza la posición en el navegador cada 5 segundos

  // const guardarPuntos = () => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     puntos.push({
  //       latitud: position.coords.latitude,
  //       longitud: position.coords.longitude,
  //     });
  //     console.log("GUARDANDO PUNTOS--------------------------------------------------------------")
  //     console.log(puntos)
  //     console.log(puntos.length)

  //   });
  //   setTimeout(guardarPuntos, 4000);

  // };
  // useEffect(guardarPuntos,[]);
  //------------------------------------------------------------------------------------------------------------------------------------------
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
  let latitud_2=0;
  let longitud_2=0;
  useEffect(() => {
    if (!isWaiting) {
      if (acumular) {
        navigator.geolocation.getCurrentPosition((position) => {
          let latitud = position.coords.latitude;
          let longitud = position.coords.longitude;
          latitud_2=latitud_2==0?latitud:latitud_2;
          longitud_2=longitud_2==0?longitud:longitud_2;

          if(calcularDistanciaDosPuntos(latitud_2,longitud_2,latitud,longitud)>11.11){
            datos.push({
              latitud,
              longitud,
            });
          }
          latitud_2=latitud;
          longitud_2=longitud;
        });
      }
      console.log(datos);
      setIsWaiting(true);
    }
  }, [isWaiting]);
  //------------------------------------------------------------------------------------------------------------------------------------------

  const recorrido = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      // console.log("recorrido")
      setPosicionActual([position.coords.latitude, position.coords.longitude]);
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
    });
    setTimeout(recorrido, 4000);
  };
  function acumularDistancia() {
    console.log("DISTANCIA ENTRE DOS PUNTOS---------------------------------------------------------------------------------------------------");
    let distancia=calcularDistanciaDosPuntos(latitud1,longitud1,latitud2,longitud2)
    console.log(distancia);
    if(distancia>11.11){
      total = total + distancia;
      setDistanciaRecorrida(total);
    }
  }
  function calcularDistanciaDosPuntos(latitud1,longitud1,latitud2,longitud2) {
    // console.log(
    //   "---------------------------------------------------------------------------"
    // );
    // console.log(latitud1);
    // console.log(longitud1);
    // console.log(latitud2);
    // console.log(longitud2);

    var R = 6371000; // km
    //has a problem with the .toRad() method below.

    var R = 6371000; // km
    //has a problem with the .toRad() method below.
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
  // Llamamos a la función recorrido al montar el componente
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
      distanciaKilometros: distanciaRecorrida/1000,
      fecha: new Date(),
      tiempoHoras: time / 3600,
    };
    db.collection("recorridos")
      .where("UIDUsuario", "==", user.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          insertarRecorrido(doc.id, miDocumento);
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    console.log(miDocumento);

    document
      .getElementById("guardar_distancia")
      .setAttribute("href", "./../DatosPersonales/pagina.html");
    setTime(0);
    setIsRunning(false);
    navigate("/datos-recorridos");
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
    miSubColeccion
      .add(documento)
      .then((docRef) => {
        console.log("Documento registrado con ID:", docRef.id);
        const miSubSubColeccion = miSubColeccion
          .doc(docRef.id)
          .collection("puntosRecorridos");

        datos.map(({ latitud, longitud }) => {
          miSubSubColeccion
            .add({
              latitud: longitud,
              longitud: latitud,
            })
            .then(function (docRef) {
              console.log(
                "PUNTO AGREGADO------------------------------------------------: ",
                docRef.id
              );
            })
            .catch(function (error) {
              console.error("Error al agregar PUNTO el documento: ", error);
            });
        });
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
    console.log("FULL SCREEN INITIAL STATE--------------------------------------------------------"+isFullscreen)
    setIsFullscreen(!isFullscreen);
    
    if (!isFullscreen) {
      setIsFullscreen(!isFullscreen);
      document.documentElement.requestFullscreen();

    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    console.log("FULL SCREEN STATE--------------------------------------------------------"+isFullscreen)
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
        handleState()
      }, 5000);
    };

    const handleTouchEnd = () => {
      clearTimeout(interval);
    };

  
    const handleMouseDown = () => {
      interval = setTimeout(() => {
        handleState()
      }, 5000);
    };

    const handleMouseUp = () => {
      clearTimeout(interval);
    };



  return (
    <div className="total" style={{background: isPaginaNormal?"white":"#343537"}}>
      <div
        style={{
          width: "100vw",
          display: isPaginaNormal ? "flex" : "none",
          minHeight:"100vh",
          textAlign: "center",
          flexDirection: "column",
          fontSize: "0.8rem",
          background: "white"
        }}
      >
        <h1>Controlador de distancia</h1>
        <p>Distancia en metros = {distanciaRecorrida.toFixed(2)}</p>
        <button
          onClick={handleState}
          style={{ backgroundColor: sumarTotal ? "red" : "green" }}
        >
          {sumarTotal ? "Pausar" : "Encender"}
        </button>
        {/* <button onClick={handleReset}>Reset</button> */}
        <button
          id="guardar_distancia"
          onClick={handleGuardarInformacion}
          style={{ backgroundColor: "#15C0EA" }}
        >
          Guardar distancia recorrida
        </button>
        <Cronometro
          time={time}
          setTime={setTime}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
        />
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
      </div>

      <div
        id="registrando-recorrido"
        style={{
          width: "100%",
          justifyContent: "center",
          height: "80%",
          background: "#343537",
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
      <div id="boton-cambio-estado" style={{paddingBottom:"5px", height:"20%"}}>
        <button onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onTouchStart={handlePresion} onTouchEnd={handleTouchEnd} style={{height:"40px"}}>{isFullscreen ? "Pausar" : ""}</button>
      </div>
    </div>
  );
};

export default Recorrido;
