import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import './SearchField.css'

const SearchField = () => {

  const provider = new OpenStreetMapProvider({
    params: {
      countrycodes: 'BO',
    },
  });

  const map = useMap();

  // @ts-ignore
  let searchControl = new GeoSearchControl({
    provider: provider,
    notFoundMessage: 'Lo sentimos, no encontramos el lugar',
    showMarker: true,
    searchLabel: 'Buscar',
    style: 'bar',
    autoComplete: true,
    autoCompleteDelay: 250,
  });

  useEffect(() => {
    if (map) {
      map.addControl(searchControl);
    }
    return () => {
      if (map) {
        map.removeControl(searchControl);
      }
    };
  }, [map]);

  return null;
};


export default SearchField;
