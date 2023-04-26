import React, { useState,useEffect } from "react";
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
          <li className="elemento-link">
            <Link to="/">Inicio</Link>
          </li>
          <li id="opciones-usuario" onClick={handleMostrarOU}>
            Opciones usuario
            {mostrarOU?
              <ul>
              <li className="elemento-link">
                <Link to="/menu-principal">Menu principal</Link>
              </li>
              <li className="elemento-link">
                <Link to="/recorrido">Registrar recorrido</Link>
              </li>
              <li className="elemento-link">
                <Link to="/datos-recorridos">Ver mis recorridos</Link>
              </li>
              <li className="elemento-link">
                <Link to="/recorridos-mapa">Recorridos en mapa</Link>
              </li>
              
            </ul>
            :
            <>
            </>
            }
            
          </li>
          <li className="elemento-link">
            <Link to="/mapabicidatos">Mapa</Link>
          </li>
          <li className="elemento-link">
            <Link to="/">Colectivos ciclistas</Link>
          </li>
          <li className="elemento-link">
            <Link to="/">Bici-blog</Link>
          </li>
          <li className="elemento-link">
            <Link to="/">Publicaciones</Link>
          </li>
          <li className="elemento-link">
            <Link to="/">Eventos</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
