import TextField from '@material-ui/core/TextField';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import './SearchCoordinates.css';
import Alert from './Alert';


const SearchCoordinates = ({ setShowSearchCoordinates }) => {
  const formRef = useRef < HTMLFormElement | null > (null);
  const navigate = useNavigate();
  const mapRef = useRef < L.Map | null > (null);
  const map = useMap();
  const [coordinates, setCoordinates] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCoordinates(e.target.value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!coordinates) {
      setError('Inserte las coordenadas');
      return;
    }

    const [lat, lng] = coordinates.split(',').map((coord) => coord.trim());

    if (!isValidCoordinate(parseFloat(lat), parseFloat(lng))) {
      setError('Formato de coordenadas incorrecto');
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }

    if (coordinates) {
      const [lat, lng] = coordinates.split(',').map((coord) => parseFloat(coord.trim()));

      if (!isNaN(lat) && !isNaN(lng) && isValidCoordinate(lat, lng)) {
        map.flyTo([lat, lng], 16, {
          duration: 1,
          easeLinearity: 0.25,
        });
      }
    }

    navigate(`/mapa?lat=${lat}&lng=${lng}`, { replace: true });

    if (mapRef.current) {
      const zoomLevel = 16;
      mapRef.current.setView([parseFloat(lat), parseFloat(lng)], zoomLevel);
    }
    setShowSearchCoordinates(false);
  };

  function isValidCoordinate(latitud, longitud) {
    const regexLat = /^(-?(?:90(\.0{1,18})?|[1-8]?\d(\.\d{1,18})?))$/;
    const regexLon = /^(-?(?:180(\.0{1,18})?|(?:1[0-7]|[1-9]?\d)(\.\d{1,18})?))$/;

    let validLat = regexLat.test(latitud);
    let validLon = regexLon.test(longitud);

    if (validLat && validLon) {
      const lat = latitud;
      const lon = longitud;

      if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    if (formRef.current) {
      L.DomEvent.disableClickPropagation(formRef.current);
    }
  }, []);

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        style={{
          position: 'absolute',
          zIndex: '533',
          minWidth: '300px',
          maxWidth: '376px',
          borderRadius: '24px',
          background: '#fff',
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          height: '45px',
          width: '100%',
          overflow: 'hidden',
          transitionProperty: 'background, box-shadow',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02)',
        }}
        className="form-search"
      >
        <div>
          <TextField
            style={{ textAlign: "center" }}
            label='Ingrese la coordenada:'
            variant='filled'
            value={coordinates}
            onChange={handleChange}
            InputProps={{ placeholder: '-17.3895,-66.1568' }}
          />
        </div>
      </form>
      {error && <Alert type='error' message={error} isVisible={true} />}
    </>
  );
};

export default SearchCoordinates;
