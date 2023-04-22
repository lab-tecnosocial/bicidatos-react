import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
const Sidebar = (props) => {
  let [mostrarOU,setMostrarOU]=useState(false);
  const handleMostrarOU=(e)=> {
    setMostrarOU(!mostrarOU)
  }
  return (
    <>
      <div className={`sidebar`}>
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li id="opciones-usuario" onClick={handleMostrarOU}>
            Opciones usuario
            {mostrarOU?
              <ul>
              <li>
                <Link to="/menu-principal">Menu principal</Link>
              </li>
              <li>
                <Link to="/recorrido">Registrar recorrido</Link>
              </li>
              <li>
                <Link to="/datos-recorridos">Ver mis recorridos</Link>
              </li>
              
            </ul>
            :
            <>
            </>
            }
            
          </li>
          <li>
            <Link to="/mapabicidatos">Mapa</Link>
          </li>
          <li>
            <Link to="/">Colectivos ciclistas</Link>
          </li>
          <li>
            <Link to="/">Bici-blog</Link>
          </li>
          <li>
            <Link to="/">Publicaciones</Link>
          </li>
          <li>
            <Link to="/">Eventos</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
