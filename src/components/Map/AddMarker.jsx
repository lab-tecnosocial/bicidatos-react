import { useState } from "react";
import { LatLng, LatLngExpression } from "leaflet";
import { useMapEvents, Marker } from "react-leaflet";
import { connect } from "react-redux";
import { setPlaceFormVisibility, setPrePlaceLocation, setSelectedPlace } from "../../store/actions";
import { setPlacePreviewVisibility } from "../../store/actions";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";

const AddMarker = ({ formIsOpen, toggleForm, setLocation, closePreview, place, nullPlace, closeForm }) => {
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useMapEvents({
    click: (e) => {
      const boliviaLatLng = {
        north: -10.48105, // Latitud norte aproximada
        south: -22.89189, // Latitud sur aproximada
        east: -57.5352, // Longitud este aproximada
        west: -69.64581, // Longitud oeste aproximada
      };

      if (
        e.latlng.lat >= boliviaLatLng.south &&
        e.latlng.lat <= boliviaLatLng.north &&
        e.latlng.lng >= boliviaLatLng.west &&
        e.latlng.lng <= boliviaLatLng.east
      ) {
        setPosition(e.latlng);
        navigate(`/mapa?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
        setLocation(e.latlng);
        toggleForm(true);
        nullPlace();
        closePreview();
        setShowAlert(false);
      } else {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    },
  });

  return (
    <>
      {showAlert && (
        <Alert
          type="error"
          message='¡Por favor, seleccione un punto valido!'
          isVisible={showAlert}
        />
      )}
      {!formIsOpen || position === null ? null : (
        <Marker position={position}></Marker>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const { places } = state;
  return {
    formIsOpen: places.placeFormIsVisible,
    place: places.selectedPlace,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleForm: (payload) => dispatch(setPlaceFormVisibility(payload)),
    setLocation: (payload) => dispatch(setPrePlaceLocation(payload)),
    nullPlace: () => dispatch(setSelectedPlace(null)),
    closePreview: () => dispatch(setPlacePreviewVisibility(false)),
    closeForm: () => dispatch(setPlaceFormVisibility(false)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMarker);
