import L from "leaflet";

// Iconos de markers

const iconoBiciparqueo = L.icon({
    iconUrl: '/public/img/iconoParqueo.png',
    iconSize: [35, 35],
    shadowSize: [30, 30],
    shadowAnchor: [8, 25],
    iconAnchor: [15, 30]
  
  });
  
  const iconoServicio = L.icon({
    iconUrl: '/public/img/iconoServicio.png',
    iconSize: [35, 35],
    shadowSize: [30, 30],
    shadowAnchor: [8, 25],
    iconAnchor: [15, 30]
  
  });
  
  const iconoDenuncia = L.icon({
    iconUrl: '/public/img/iconoDenuncia.png',
    iconSize: [35, 35],
    shadowSize: [30, 30],
    shadowAnchor: [8, 25],
    iconAnchor: [15, 30]
  
  });
  
  const iconoAforo = L.icon({
    iconUrl: '/public/img/iconoAforo.png',
    iconSize: [35, 35],
    shadowSize: [30, 30],
    shadowAnchor: [8, 25],
    iconAnchor: [15, 30]
  
  });
  
  export {iconoBiciparqueo, iconoServicio, iconoDenuncia, iconoAforo};