import { useState } from "react";
import { useStore } from "../../store/context";
import { useMapEvents, Marker } from "react-leaflet";
import Alert from "./Alert";

const AddMarker = () => {
  const [position, setPosition] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const { state, dispatch } = useStore();
  const formIsOpen = state.placeFormIsVisible;

  const toggleForm = (value) => {
    dispatch({ type: "SET_PLACE_FORM_VISIBILITY", payload: value });
  }

  const setLocation = (location) => {
    dispatch({ type: "SET_PRE_PLACE_LOCATION", payload: location });
  }

  const nullPlace = () => {
    dispatch({ type: "SET_SELECTED_PLACE", payload: null });
  }

  const closePreview = () => {
    dispatch({ type: "SET_PLACE_PREVIEW_VISIBILITY", payload: false });
  }

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

export default AddMarker;
