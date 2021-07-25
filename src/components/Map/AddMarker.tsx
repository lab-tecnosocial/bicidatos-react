import React, { useState } from "react";
import { LatLng, LatLngExpression } from "leaflet";
import { Marker, useMapEvents } from "react-leaflet";
import { connect } from "react-redux";
import { setPlaceFormVisibility, setPrePlaceLocation, setSelectedPlace } from "../../store/actions";
import { setPlacePreviewVisibility } from "../../store/actions";

const AddMarker = ({ formIsOpen, toggleForm, setLocation, closePreview, place, nullPlace }: any) => {
  const [position, setPosition] = useState(
    (null as unknown) as LatLngExpression
  );

  useMapEvents({
    click: (e) => {
      setPosition(e.latlng);
      setLocation(e.latlng);
      toggleForm(true);
      nullPlace();
      closePreview();
    },
  });

  return !formIsOpen || position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const mapStateToProps = (state: any) => {
  const { places } = state;
  return {
    formIsOpen: places.placeFormIsVisible,
    place: places.selectedPlace
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    toggleForm: (payload: boolean) => dispatch(setPlaceFormVisibility(payload)),
    setLocation: (payload: LatLng) => dispatch(setPrePlaceLocation(payload)),
    nullPlace: () => dispatch(setSelectedPlace(null)),
    closePreview: () =>
      dispatch(setPlacePreviewVisibility(false))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMarker);
