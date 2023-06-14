// react
import { useEffect, useState } from "react";
// mui and style
import { LinearProgress } from "@material-ui/core";
import "./Map.css";
// leaflet
import { LatLngExpression } from "leaflet";
import { MapContainer, useMapEvents, TileLayer, Marker, Tooltip, LayersControl, LayerGroup, GeoJSON, Polyline } from 'react-leaflet';
import { iconoBiciparqueo, iconoServicio, iconoDenuncia, iconoAforo } from "./icons";
// redux
import { connect, useDispatch } from "react-redux";
import { setPlacePreviewVisibility, setSelectedPlace } from "../../store/actions";
// firebase
import db from "../../database/firebase";
// aux components
import AddMarker from "./AddMarker";
import { firebase, googleAuthProvider } from "../../database/firebase";
import { useNavigate } from "react-router-dom";
import { guardarUsuario } from '../../auxiliar/action';
import { auth } from "../../database/firebase";



import { FormDepartamento } from "../Form/FormDepartamento";
// aux data
import { departamentos } from "./local-places";


const Map = ({
  isVisible,
  places,
  selectedPlace,
  togglePreview,
  setPlaceForPreview,
}: any) => {
  const defaultPosition: LatLngExpression = [-17.396, -66.153]; // Cochabamba
  const [aforos2, setAforos2] = useState([] as any);
  const [biciparqueos2, setBiciparqueos2] = useState([] as any);
  const [servicios2, setServicios2] = useState([] as any);
  const [denuncias2, setDenuncias2] = useState([] as any);
  const [loading, setLoading] = useState(false);
  const [ciclovias, setCiclovias] = useState({} as any);

  useEffect(() => {

    getCicloviasFromGithub();
    console.log(ciclovias);
  }, [])


  const MapEvents = () => {

    useMapEvents({
      overlayadd: (e) => {
        console.log(e.name)
        switch (e.name) {
          case "Biciparqueos":
            getBiciparqueos2FromFirebase();
            break;
          case "Servicios":
            getServicios2FromFirebase();
            break;
          case "Denuncias":
            getDenuncias2FromFirebase();
            break;
          case "Aforos":
            getAforos2FromFirebase();
            break;

        }
      }
    });
    return null;
  }


  const getBiciparqueos2FromFirebase = async () => {
    const biciparqueosRef = db.collection('biciparqueos2');
    setLoading(true);
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
    setBiciparqueos2(data);
    setLoading(false);
  };
  const getServicios2FromFirebase = async () => {
    const serviciosRef = db.collection('servicios2');
    setLoading(true);
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
    setServicios2(data)
    setLoading(false);
  };
  const getAforos2FromFirebase = async () => {
    const aforosRef = db.collection('aforos2');
    setLoading(true);
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
    setAforos2(data);
    setLoading(false);
  };

  const getDenuncias2FromFirebase = async () => {
    const denunciasRef = db.collection('denuncias2');
    setLoading(true);
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
    setDenuncias2(data)
    setLoading(false);
  };


  const getCicloviasFromGithub = async () => {
    const url = 'https://raw.githubusercontent.com/fradevgb/bicidatos/main/data2/ciclovias.geojson';
    const cicloviasData = await fetch(url).then(response => response.json())
    console.log(cicloviasData);
    setCiclovias(cicloviasData);
    return ciclovias;
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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signInWithGoogle = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithPopup(googleAuthProvider)
      .then((value) => {
        console.log(value);
        console.log("DISPATCH LOGIN-------------------------------------------------------------------------------------------------------")
        dispatch(guardarUsuario((value.user)));

        navigate('/menu-principal');
      });
  };


  const signOut = async () => {
    firebase.auth().signOut();
  }

  return (
    <div className="map__container">
      {
        <div>

          {loading ? <LinearProgress style={{ height: '0.5em' }} /> : null}
          <MapContainer
            center={defaultPosition}
            zoom={6}
            scrollWheelZoom={true}
            style={{ height: "100vh" }}
            zoomControl={true}
          >
            <FormDepartamento departamentos={departamentos} />
            <LayersControl position="bottomleft" collapsed={false} >
              <LayersControl.BaseLayer checked name="Base">

                <TileLayer
                  attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                  url="https://api.mapbox.com/styles/v1/labtecnosocial/ckmrvd5jx2gbu17p7atlk1xay/tiles/{z}/{x}/{y}?access_token=sk.eyJ1IjoibGFidGVjbm9zb2NpYWwiLCJhIjoiY2ttcnBlcG53MDl4ejJxcnMyc3N2dGpoYSJ9.MaXq1p4n25cMQ6gXIN14Eg" maxZoom={19} tileSize={512} zoomOffset={-1}
                />

              </LayersControl.BaseLayer>

              <LayersControl.Overlay name="Biciparqueos">
                <LayerGroup>
                  {biciparqueos2.map((biciparqueo: any) =>
                    <Marker
                      key={biciparqueo.id}
                      position={[biciparqueo.latitud, biciparqueo.longitud]}
                      eventHandlers={{ click: () => showPreview(biciparqueo) }}
                      icon={iconoBiciparqueo}
                    >
                      <Tooltip>Biciparqueo</Tooltip>
                    </Marker>
                  )
                  }
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Servicios">
                <LayerGroup>
                  {servicios2.map((servicio: any) =>
                    <Marker
                      key={servicio.id}
                      position={[servicio.latitud, servicio.longitud]}
                      eventHandlers={{ click: () => showPreview(servicio) }}
                      icon={iconoServicio}
                    >
                      <Tooltip>Servicio</Tooltip>
                    </Marker>
                  )
                  }
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Denuncias">
                <LayerGroup>
                  {denuncias2.map((denuncia: any) =>
                    <Marker
                      key={denuncia.id}
                      position={[denuncia.latitud, denuncia.longitud]}
                      eventHandlers={{ click: () => showPreview(denuncia) }}
                      icon={iconoDenuncia}
                    >
                      <Tooltip>Denuncia</Tooltip>
                    </Marker>
                  )
                  }
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Aforos">
                <LayerGroup>
                  {aforos2.map((aforo: any) =>
                    <Marker
                      key={aforo.id}
                      position={[aforo.latitud, aforo.longitud]}
                      eventHandlers={{ click: () => showPreview(aforo) }}
                      icon={iconoAforo}
                    >
                      <Tooltip>Aforo</Tooltip>
                    </Marker>
                  )
                  }
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Ciclovías">
                {
                  Object.keys(ciclovias).length > 0 && <GeoJSON data={ciclovias} />}
              </LayersControl.Overlay>

            </LayersControl>
            <AddMarker />
            <MapEvents />
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
