import L, { LatLngExpression } from "leaflet";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  Polyline,
} from "react-leaflet";
import math from "mathjs";
import mathp from "mathp";

import { makeStyles } from "@material-ui/core/styles";

import "./VerRecorridosMapa.css";
import db from "../../database/firebase";
import Cronometro from "../Cronometro/Cronometro";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LatLng } from "leaflet";
import RecenterAutomatically from "../Recorrido/RecenterAutomatically";

let estadoSumarTotal = false;
let datos = [];

const VerRecorridosMapa = () => {
  const user = useSelector((state: any) => {
    return state.userReducer.user;
  });

  let [posicionActual, setPosicionActual] = useState<LatLngExpression>([
    -17.396,
    -66.153,
  ]);
  useEffect(() => {
    inicializarPuntos();
    llamarRecorridos();
  }, []);
  const polilineas = [];
  const [polis, setPolis] = useState([]);
  let [recorridos, setRecorridos] = useState([]);
  let datosEncontradosRecorridos = [];

  function llamarRecorridos() {
    const miColeccionPrincipal = db.collection("recorridos");
    const miSubColeccion = miColeccionPrincipal
      .where("UIDUsuario", "==", user.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          const historial = await db
            .collection("recorridos")
            .doc(doc.id)
            .collection("historial");
          historial.get().then((querySnapshot) => {
            querySnapshot.forEach(async (doc2) => {
              datosEncontradosRecorridos.push({
                ...doc2.data(),
                color: getRandomHexColor(),
              });

              let puntos = [];
              const puntosRecorridos = await db
                .collection("recorridos")
                .doc(doc.id)
                .collection("historial")
                .doc(doc2.id)
                .collection("puntosRecorridos");
              puntosRecorridos.get().then((querySnapshot) => {
                querySnapshot.forEach((docPuntos) => {
                  puntos.push(
                    new LatLng(
                      parseFloat(docPuntos.data().longitud),
                      parseFloat(docPuntos.data().latitud)
                    )
                  );
                });
                polilineas.push(puntos);
                puntos = [];
              });
              setPolis(polilineas);
            });
          });
          setRecorridos(datosEncontradosRecorridos);
        });
      });
  }

  function inicializarPuntos() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosicionActual([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      (error) => {},
      { enableHighAccuracy: true }
    );
  }
  function getRandomHexColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  const puntosPrueba = [
    new L.LatLng(51.505, -0.09),
    new L.LatLng(51.507, -0.06),
    new L.LatLng(51.51, -0.047),
  ];
  const convertirFormatoFecha = (data: any) => {
    const date = data.fecha.toDate();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <div id="principal">
      <div>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Distancia</th>
              <th>Tiempo</th>
              <th>Color</th>
            </tr>
          </thead>
          <tbody>
            {recorridos.map((data, index) => {
              console.log(
                "COLOCANDO DATA-------------------------------------------------------------------------------------"
              );
              console.log(new Date(data.fecha.toDate()));
              const formattedDate = convertirFormatoFecha(data);

              return (
                <tr key={index}>
                  <td>{formattedDate}</td>
                  <td>{data.distanciaKilometros.toFixed(3)} km</td>
                  <td>{data.tiempoHoras.toFixed(3)} hrs</td>
                  <td style={{ background: data.color }}>
                    <div></div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="view-total-distance">
        <MapContainer
          center={posicionActual}
          zoom={28}
          scrollWheelZoom={true}
          className="map-view-total-distance"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={posicionActual} />
          {/* <Polyline 
            pathOptions={{ color: "red" }}
            positions={puntosPrueba}
          /> */}
          {polis.map((polilinea, index) => {
            console.log(polilinea);
            return (
              <Polyline
                key={uuidv4()}
                pathOptions={{ color: recorridos[index].color + "" }}
                positions={polilinea}
              />
            );
          })}
          <RecenterAutomatically
            lat={posicionActual[0]}
            lng={posicionActual[1]}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default VerRecorridosMapa;
