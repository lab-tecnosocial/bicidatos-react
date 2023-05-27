import L, { LatLngExpression } from "leaflet";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  Polyline,
  LayersControl,
  Polygon,
  GeoJSON,
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
import { setSelectedPlace } from "../../store/actions/places";
import { data } from "../../data";
import { ContactSupportOutlined } from "@material-ui/icons";
import DatosRecorridos from "../DatosRecorridos/DatosRecorridos";

let estadoSumarTotal = false;
let datos = [];
let nuevo: any;
let elementos = [];
let polilineas: any = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        description:
          "Ciclovía construida en 1996 que recorre alrededor de la Laguna Alalay, un puente, y sobre un canal de riego bordea el Cerro de San Pedro y sigue una cuadra al norte de la Avenida América terminando en el Parque Wiracocha",
        name: "Ciclovía Norte-Este",
      },
      geometry: {
        type: "MultiLineString",
        coordinates: [],
      },
    },
  ],
};
const VerRecorridosMapa = () => {
  let [polis, setPolis] = useState<any>({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          description:
            "Ciclovía construida en 1996 que recorre alrededor de la Laguna Alalay, un puente, y sobre un canal de riego bordea el Cerro de San Pedro y sigue una cuadra al norte de la Avenida América terminando en el Parque Wiracocha",
          name: "Ciclovía Norte-Este",
        },
        geometry: {
          type: "MultiLineString",
          coordinates: [],
        },
      },
    ],
  });
  let [coordenadas, setCoordenadas] = useState([]);
  let [recorridos, setRecorridos] = useState([]);
  let datosEncontradosRecorridos = [];
  let aux = [];

  const user = useSelector((state: any) => {
    return state.userReducer.user;
  });

  let [posicionActual, setPosicionActual] = useState<LatLngExpression>([
    -17.396, -66.153,
  ]);

  useEffect(() => {
    inicializarPuntos();
    llamarRecorridos();
  }, []);

  async function llamarRecorridos() {
    const miColeccionPrincipal = db.collection("recorridos");
    const coleccion = await miColeccionPrincipal
      .where("UIDUsuario", "==", user.uid)
      .get();
    if (coleccion.docs.length > 0) {
      let historial: any = await db
        .collection("recorridos")
        .doc(coleccion.docs[0].id)
        .collection("historial")
        .get();
      console.log(historial.docs[0].data());
      let aux = [];
      for (let i = 0; i < historial.docs.length; i++) {
        datosEncontradosRecorridos.push({
          ...historial.docs[i].data(),
          color: getRandomHexColor(),
        });
        console.log(
          "RECORRIDO " +
            i +
            "-----------------------------------------------------------------------------------------------------------------------------------------"
        );
        let o = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                description:
                  "Ciclovía construida en 1996 que recorre alrededor de la Laguna Alalay, un puente, y sobre un canal de riego bordea el Cerro de San Pedro y sigue una cuadra al norte de la Avenida América terminando en el Parque Wiracocha",
                name: "Ciclovía Norte-Este",
              },
              geometry: {
                type: "MultiLineString",
                coordinates: [],
              },
            },
          ],
        };
        setRecorridos(datosEncontradosRecorridos);
        console.log(
          "ESTABLECIENDO RECORRIDOS---------------------------------------------------------------------------------------------------"
        );
        console.log(recorridos);
        o.features[0].geometry.coordinates.push(
          JSON.parse(historial.docs[i].data().puntosRecorridos).data
        );
        elementos.push(o);
        aux.push(JSON.parse(historial.docs[i].data().puntosRecorridos).data);
      }
      console.log(aux);
      polilineas.features[0].geometry.coordinates = aux;
      console.log(polilineas);

      const miSubColeccion = await miColeccionPrincipal
        .where("UIDUsuario", "==", user.uid)
        .get();
    }
  }
  useEffect(() => {
    setRecorridos(recorridos);
  }, [recorridos]);
  function agregarPuntos(aux) {
    let aux2 = [];
    for (let i = 1; i <= aux.length; i++) {
      if (i % 11 == 0) {
        polilineas.features[0].geometry.coordinates.push(aux2);
        polis.features[0].geometry.coordinates.push(aux2);
        aux2 = [];
      }
      aux2.push(aux[i]);
    }
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
          center={[0, 0]}
          zoom={28}
          scrollWheelZoom={true}
          className="map-view-total-distance"
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={posicionActual} />

          {elementos.map((data, index) => {
            console.log(
              "ELEMENTOS " +
                index +
                " ----------------------------------------------------------------------------------------------"
            );
            console.log(data);
            if (recorridos[index] != undefined) {
              console.log(recorridos[index].color);
              console.log(data);
              let val = recorridos[index].color;
              return <GeoJSON data={data} style={{ color: val + "" }} />;
            }
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
