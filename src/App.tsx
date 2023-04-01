import React from "react";
import "./App.css";

import Header from "./components/Header/Header";
import Map from "./components/Map/Map";
import Preview from "./components/Preview/Preview";
import Form from "./components/Form/Form";
import Recorrido from "./components/Recorrido/Recorrido";
import DatosRecorridos from "./components/DatosRecorridos/DatosRecorridos";

function App() {
  return (
    <>
      <nav>
        <Header />
      </nav>
      <main>
        {/* <Map />
        <Preview />
        <Form /> */}
        {/* <Recorrido />  */}
        <DatosRecorridos />
      </main>
    </>
  );
}

export default App;

// // Archivo App.tsx
// import React, { useState, useEffect } from 'react';
// import { Marker, Polyline } from 'react-leaflet';

// const App: React.FC = () => {
//   const [coordinates, setCoordinates] = useState<[number, number][]>([]);
//   const [distance, setDistance] = useState(0);

//   useEffect(() => {
//     // Obtener coordenadas aquí
//     setCoordinates([
//       [51.505, -0.09],
//       [51.50, -0.09],
//       [51.51, -0.10],
//       [54.50, -0.09],
//     ]);
//   }, []);

//   useEffect(() => {
//     // Calcular la distancia aquí
//     let totalDistance = 0;
//     for (let i = 0; i < coordinates.length - 1; i++) {
//       const [lat1, lng1] = coordinates[i];
//       const [lat2, lng2] = coordinates[i + 1];
//       const dLat = lat2 - lat1;
//       const dLng = lng2 - lng1;
//       totalDistance += Math.sqrt(dLat * dLat + dLng * dLng);
//     }
//     setDistance(totalDistance);
//   }, [coordinates]);

//   return (
//     <>
//       <h1>Distancia recorrida: {distance.toFixed(2)} km</h1>
//       {coordinates.map(([lat, lng], i) => (
//         <Marker key={i} position={[lat, lng]} />
//       ))}
//       <Polyline positions={coordinates} />
//     </>
//   );
// };

// export default App;