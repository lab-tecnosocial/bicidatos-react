import React, { useState } from "react";
import "./App.css";

import Header from "./components/Header/Header";
import Map from "./components/Map/Map";
import Preview from "./components/Preview/Preview";
import Form from "./components/Form/Form";
import Recorrido from "./components/Recorrido/Recorrido";
import DatosRecorridos from "./components/DatosRecorridos/DatosRecorridos";

import {
  Routes,
  BrowserRouter as Router,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import store from "./aux/store";
import { Provider } from "react-redux";

import AuthRouter from "./routers/AuthRouter";
import PublicRouter from "./routers/PublicRouter";
import MenuPrincipal from "./components/MenuPrincipal/MenuPrincipal";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import Sidebar from './components/Sidebar/Sidebar';
import VerRecorridosMapa from "./components/VerRecorridosMapa/VerRecorridosMapa";

function App() {
  const [log, setLog] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [verNav,setVerNav]=useState(true);
  return (
    <>
      
        <Router>
          
          <nav style={{display:(verNav)?"block":"none"}}>
            <Header isSidebarVisible={isSidebarVisible} setIsSidebarVisible={setIsSidebarVisible} log={log} setLog={setLog}/>
          </nav>
          
          <main>
          {isSidebarVisible && log?<Sidebar/>:<></>}
          <Routes>
            {/* <Route path="/" element={<Login />} />
            <Route path="/mapa" element={<Recorrido />} />
            <Route path="/datosPersonales" element={<DatosRecorridos />} /> */}
            {/* <PublicRouter path="/auth" component={AuthRouter} log={log} /> */}
            <Route path="/mapabicidatos" element={<Map/>} />
            <Route
              path="/recorrido"
              element={
                <ProtectedRoute redirectPath="/" isAllowed={log}>
                  <Recorrido setVerNav={setVerNav} verNav={verNav} setIsSidebarVisible={setIsSidebarVisible}/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/datos-recorridos"
              element={
                <ProtectedRoute redirectPath="/" isAllowed={log}>
                  <DatosRecorridos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/menu-principal"
              element={
                <ProtectedRoute redirectPath="/" isAllowed={log}>
                  <MenuPrincipal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recorridos-mapa"
              element={
                <ProtectedRoute redirectPath="/" isAllowed={log}>
                  <VerRecorridosMapa />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<Map />} />
          </Routes>
          </main>
        </Router>
    </>

    // <>
    //   <nav>
    //     <Header />
    //   </nav>

    //   <main>
    //     {/* <Map />
    //     <Preview />
    //     <Form /> */}
    //     {/* <Recorrido />  */}
    //     {/* <DatosRecorridos /> */}
    //     <Login />
    //   </main>
    // </>
  );
}
const ProtectedRoute = ({ isAllowed, redirectPath = "/", children }) => {
  console.log("PROTECTED ROUTE------------------------------------------------------------------------------------")
  console.log(isAllowed);
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
};
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
