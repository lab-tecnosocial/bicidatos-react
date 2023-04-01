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

import { makeStyles } from '@material-ui/core/styles';

import "./Recorrido.css";


let estadoSumarTotal=false;

const Recorrido = () => {
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
        setPosicionActual([position.coords.latitude, position.coords.longitude]);

        recorrido();

        // setPunto1([position.coords.latitude, position.coords.longitude]);

        // setPunto2([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {},
      { enableHighAccuracy: true }
    );
  }
  // Función que actualiza la posición en el navegador cada 5 segundos
  const recorrido = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      // console.log("recorrido")
      setPosicionActual([position.coords.latitude, position.coords.longitude]);
      //setPunto2([position.coords.latitude, position.coords.longitude]);
      latitud2 = position.coords.latitude;
      longitud2 = position.coords.longitude;
      // setPunto2([position.coords.latitude, position.coords.longitude]);
      // console.log(sumarTotal)
      if(estadoSumarTotal){
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
    // console.log("acumular distancia");
    calcularDistanciaDosPuntos();
    total = total + calcularDistanciaDosPuntos();
    setDistanciaRecorrida(total);
  }
  function calcularDistanciaDosPuntos() {
    // console.log(
    //   "---------------------------------------------------------------------------"
    // );
    // console.log(latitud1);
    // console.log(longitud1);
    // console.log(latitud2);
    // console.log(longitud2);

    var R = 6371; // km
    //has a problem with the .toRad() method below.

    var R = 6371; // km
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
    console.log(d);
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
  let [sumarTotal,setSumarTotal]=useState(false);
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
  const handleSumarTotal = (e) => {
    console.log("cambiar estado")
    console.log("anterior "+estadoSumarTotal);
    estadoSumarTotal=!estadoSumarTotal;
    setSumarTotal(!sumarTotal);
    console.log("actualizado "+estadoSumarTotal)
  }
  const handleGuardarInformacion=(e)=> {
    console.log("Guardar informacion")
    document.getElementById('guardar_distancia').setAttribute('href', "./../DatosPersonales/pagina.html");
  }
  
  return (
    
    <div className="view-total-distance">
      <h1>Controlador de distancia</h1>
      <p>Distancia en metros = {distanciaRecorrida*1000}</p>
      <button onClick={handleSumarTotal} style={{backgroundColor:(sumarTotal)?"red":"green"}}>{(sumarTotal?"Apagar":"Encender")}</button>
      <button id="guardar_distancia" onClick={handleGuardarInformacion} style={{backgroundColor:"#15C0EA"}}>Guardar distancia recorrida</button>

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
  );
};

export default Recorrido;

