import React, { useEffect, useState } from "react";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Tooltip, LayersControl } from "react-leaflet";
import { connect } from "react-redux";
import { setPlacePreviewVisibility, setSelectedPlace } from "../../store/actions";
import AddMarker from "./AddMarker";
import "./Map.css";
import db from "../../database/firebase";
import {auth, provider} from "../../database/firebase";

const Map = ({
  isVisible,
  places,
  selectedPlace,
  togglePreview,
  setPlaceForPreview,
}: any) => {
  const defaultPosition: LatLngExpression = [-17.396, -66.153]; // Cochabamba
  const [aforos,setAforos] = useState([] as any);
  const [biciparqueos,setBiciparqueos] = useState([] as any);
  const [servicios,setServicios] = useState([] as any);
  const [denuncias,setDenuncias] = useState([] as any);
  const [loading,setLoading] = useState(false);
  const [user,setUser] = useState(null);
  if(user){
    // console.log(user);
  }else{
    // console.log(null);
  }
  useEffect(()=>{
    auth.onAuthStateChanged(persona =>{
      if(persona){
        setUser(persona);
      }else{
        setUser(null);
      }
    })
    getBiciparqueosFromFirebase();
    getServiciosFromFirebase();
    getDenunciasFromFirebase();
    getAforosFromFirebase();
  },[])

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
   const data = await  [...arr];
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
    let arr:any = [];
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
    let arr:any = [];
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
    let arr:any = [];
    snapshot.forEach(doc => {
      arr.push(doc.data());
    });
    const data = await  [...arr];
    setAforos(data);
    setLoading(false);
  };

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

  const signInWithGoogle = async() => {
    try{
      await auth.signInWithPopup( provider)
    }
    catch(error){
      console.log(error);
    }
  }

  const signOut = async() =>{
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
            <Marker position={[-17.396, -66.153]}></Marker>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Servicios">
            <Marker position={[-17.410, -66.153]}></Marker>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Denuncias">
            <Marker position={[-17.420, -66.153]}></Marker>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Aforos">
            <Marker position={[-17.430, -66.153]}></Marker>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Ciclovías">
            <Marker position={[-17.450, -66.153]}></Marker>
          </LayersControl.Overlay>

        </LayersControl>
        {places.map((place: any) => (
          <Marker
            key={place.title}
            position={place.position}
            eventHandlers={{ click: () => showPreview(place) }}
          >
            <Tooltip>{place.tipo}</Tooltip>
          </Marker>
        ))}
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
