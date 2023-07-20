import { useState } from "react";
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

import MenuPrincipal from "./components/MenuPrincipal/MenuPrincipal";
import Sidebar from './components/Sidebar/Sidebar';
import VerRecorridosMapa from "./components/VerRecorridosMapa/VerRecorridosMapa";
import OpcionesRecorridos from "./components/OpcionesRecorridos/OpcionesRecorridos";
import { FormBici } from "./components/Form/FormBici";
import { FormUser } from "./components/Form/FormUser";

function App() {
  const [log, setLog] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
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
            <Route path="/mapabicidatos" element={<Map/>} />
            <Route 
              path="/registro-user"
              element={
                <ProtectedRoute redirectPath="/" isAllowed={log}>
                  <FormUser/>
                </ProtectedRoute>
                }
            />
            <Route
              path="/registro-bici"
              element={
                <ProtectedRoute redirectPath="/" isAllowed={log}>
                  <FormBici />
                </ProtectedRoute>
              }
            />
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
            <Route
              path="/opciones-recorridos"
              element={
                <ProtectedRoute redirectPath="/" isAllowed={log}>
                  <OpcionesRecorridos />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<Map />} />
          </Routes>
          </main>
        </Router>
    </>


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
