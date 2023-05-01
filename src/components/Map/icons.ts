import L from "leaflet";

// Iconos de markers

const iconoBiciparqueo = L.icon({
    iconUrl: 'https://bicidatos.org/wp-content/uploads/2021/03/location-parqueo-e1617504997591.png',
    shadowUrl: 'https://bicidatos.org/wp-content/uploads/2021/03/location-shadow.png',
    iconSize: [35, 35],
    shadowSize: [30, 30],
    shadowAnchor: [8, 25],
    iconAnchor: [15, 30]
  
  });
  
  const iconoServicio = L.icon({
    iconUrl: 'https://bicidatos.org/wp-content/uploads/2021/03/location-taller-e1617504970484.png',
    shadowUrl: 'https://bicidatos.org/wp-content/uploads/2021/03/location-shadow.png',
    iconSize: [35, 35],
    shadowSize: [30, 30],
    shadowAnchor: [8, 25],
    iconAnchor: [15, 30]
  
  });
  
  const iconoDenuncia = L.icon({
    iconUrl: 'https://bicidatos.org/wp-content/uploads/2021/03/location-seguridad-e1617505231488.png',
    shadowUrl: 'https://bicidatos.org/wp-content/uploads/2021/03/location-shadow.png',
    iconSize: [35, 35],
    shadowSize: [30, 30],
    shadowAnchor: [8, 25],
    iconAnchor: [15, 30]
  
  });
  
  const iconoAforo = L.icon({
    iconUrl: 'https://bicidatos.org/wp-content/uploads/2021/04/location-aforos.png',
    shadowUrl: 'https://bicidatos.org/wp-content/uploads/2021/03/location-shadow.png',
    iconSize: [35, 35],
    shadowSize: [30, 30],
    shadowAnchor: [8, 25],
    iconAnchor: [15, 30]
  
  });
  
  export {iconoBiciparqueo, iconoServicio, iconoDenuncia, iconoAforo};