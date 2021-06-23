import React, { useEffect, useState } from "react";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Tooltip, LayersControl, LayerGroup, GeoJSON } from "react-leaflet";
import { connect } from "react-redux";
import { setPlacePreviewVisibility, setSelectedPlace } from "../../store/actions";
import AddMarker from "./AddMarker";
import "./Map.css";
import db from "../../database/firebase";
import { auth, provider } from "../../database/firebase";

const Map = ({
  isVisible,
  places,
  selectedPlace,
  togglePreview,
  setPlaceForPreview,
}: any) => {
  const defaultPosition: LatLngExpression = [-17.396, -66.153]; // Cochabamba
  const [aforos, setAforos] = useState([] as any);
  const [biciparqueos, setBiciparqueos] = useState([] as any);
  const [servicios, setServicios] = useState([] as any);
  const [denuncias, setDenuncias] = useState([] as any);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [ciclovias, setCiclovias] = useState({} as any);
  if (user) {
    // console.log(user);
  } else {
    // console.log(null);
  }
  useEffect(() => {
    auth.onAuthStateChanged(persona => {
      if (persona) {
        setUser(persona);
      } else {
        setUser(null);
      }
    })
    getBiciparqueosFromFirebase();
    getServiciosFromFirebase();
    getDenunciasFromFirebase();
    getAforosFromFirebase();
    getCicloviasFromGithub();
  }, [])

  const getBiciparqueosFromFirebase = async () => {
    const biciparqueosRef = db.collection('biciparqueos');
    const snapshot = await biciparqueosRef.get();
    if (snapshot.empty) {
      console.log('No se encontraron biciparqueos.');
      setLoading(false);
      return;
    }
    let arr: any = [];
    snapshot.forEach(doc => {
      arr.push(doc.data());
    });
    const data = await [...arr];
    setBiciparqueos(data);
    setLoading(false);
  };

  const getServiciosFromFirebase = async () => {
    setLoading(true);
    const serviciosRef = db.collection('servicios');
    const snapshot = await serviciosRef.get();
    if (snapshot.empty) {
      console.log('No se encontraron servicios.');
      setLoading(false);
      return;
    }
    let arr: any = [];
    snapshot.forEach(doc => {
      arr.push(doc.data());
    });
    const data = await [...arr];
    setServicios(data)
    setLoading(false);
  };

  const getDenunciasFromFirebase = async () => {
    const denunciasRef = db.collection('denuncias');
    const snapshot = await denunciasRef.get();
    if (snapshot.empty) {
      console.log('No se encontraron denuncias.');
      setLoading(false);
      return;
    }
    let arr: any = [];
    snapshot.forEach(doc => {
      arr.push(doc.data());
    });
    const data = await [...arr];
    setDenuncias(data)
    setLoading(false);
  };

  const getAforosFromFirebase = async () => {
    const aforosRef = db.collection('aforos');
    const snapshot = await aforosRef.get();
    if (snapshot.empty) {
      console.log('No se encontraron aforos.');
      setLoading(false);
      return;
    }
    let arr: any = [];
    snapshot.forEach(doc => {
      arr.push(doc.data());
    });
    const data = await [...arr];
    setAforos(data);
    setLoading(false);
  };

  const getCicloviasFromGithub = async () => {
    const url = 'https://raw.githubusercontent.com/lab-tecnosocial/bicidatos/main/data2/ciclovias.geojson';
    const cicloviasData = await fetch(url).then( response => response.json() )
    setCiclovias(cicloviasData);
  }

  const showPreview = (place: any) => {
    if (isVisible) {
      togglePreview(false);
      setPlaceForPreview(null);
    }

    if (selectedPlace || !isVisible) {
      setTimeout(() => {
        showPlace(place);
      }, 200);
    }
  };

  const showPlace = (place: any) => {
    setPlaceForPreview(place);
    togglePreview(true);
  };

  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(provider)
    }
    catch (error) {
      console.log(error);
    }
  }

  const signOut = async () => {
    auth.signOut();
  }
  return (
    <div className="map__container">
      {
        loading ? <h1>Cargando...</h1> :
          <div>
            {
              user ? <button onClick={signOut}>Cerrar sesión</button> :
                <button onClick={signInWithGoogle}>Iniciar sesión con Google</button>
            }

            <MapContainer
              center={defaultPosition}
              zoom={12}
              scrollWheelZoom={true}
              style={{ height: "100vh" }}
              zoomControl={true}
            >
              <LayersControl position="bottomleft" collapsed={false}>
                <LayersControl.BaseLayer checked name="Base">
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </LayersControl.BaseLayer>

                <LayersControl.Overlay name="Biciparqueos">
                  <LayerGroup>
                    {biciparqueos.map((biciparqueo: any) =>
                      <Marker
                        key={biciparqueo.id}
                        position={[biciparqueo.latitud, biciparqueo.longitud]}
                        eventHandlers={{ click: () => showPreview(biciparqueo) }}
                      >
                        <Tooltip>Biciparqueo</Tooltip>
                      </Marker>
                    )
                    }
                  </LayerGroup>
                </LayersControl.Overlay>

                <LayersControl.Overlay name="Servicios">
                  <LayerGroup>
                    {servicios.map((servicio: any) =>
                      <Marker
                        key={servicio.id}
                        position={[servicio.latitud, servicio.longitud]}
                        eventHandlers={{ click: () => showPreview(servicio) }}
                      >
                        <Tooltip>Servicio</Tooltip>
                      </Marker>
                    )
                    }
                  </LayerGroup>
                </LayersControl.Overlay>

                <LayersControl.Overlay name="Denuncias">
                  <LayerGroup>
                    {denuncias.map((denuncia: any) =>
                      <Marker
                        key={denuncia.id}
                        position={[denuncia.latitud, denuncia.longitud]}
                        eventHandlers={{ click: () => showPreview(denuncia) }}
                      >
                        <Tooltip>Denuncia</Tooltip>
                      </Marker>
                    )
                    }
                  </LayerGroup>
                </LayersControl.Overlay>

                <LayersControl.Overlay name="Aforos">
                <LayerGroup>
                    {aforos.map((aforo: any) =>
                      <Marker
                        key={aforo.id}
                        position={[aforo.latitud, aforo.longitud]}
                        eventHandlers={{ click: () => showPreview(aforo) }}
                      >
                        <Tooltip>Aforo</Tooltip>
                      </Marker>
                    )
                    }
                  </LayerGroup>
                </LayersControl.Overlay>

                <LayersControl.Overlay name="Ciclovías">
                  <GeoJSON 
                    data={ciclovias}
                  />
                </LayersControl.Overlay>

              </LayersControl>
              <AddMarker />
            </MapContainer>
          </div>

      }

    </div>
  );
};

const mapStateToProps = (state: any) => {
  const { places } = state;
  return {
    isVisible: places.placePreviewsIsVisible,
    places: places.places,
    selectedPlace: places.selectedPlace,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    togglePreview: (payload: boolean) =>
      dispatch(setPlacePreviewVisibility(payload)),
    setPlaceForPreview: (payload: any) =>
      dispatch(setSelectedPlace(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
