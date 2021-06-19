import React, { useEffect, useState } from "react";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Tooltip, LayersControl } from "react-leaflet";
import { connect } from "react-redux";
import { setPlacePreviewVisibility, setSelectedPlace } from "../../store/actions";
import AddMarker from "./AddMarker";
import "./Map.css";



const Map = ({
  isVisible,
  places,
  selectedPlace,
  togglePreview,
  setPlaceForPreview,
}: any) => {
  const defaultPosition: LatLngExpression = [-17.396, -66.153]; // Cochabamba


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

  return (
    <div className="map__container">
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
