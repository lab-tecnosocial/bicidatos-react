import React, { useState } from "react";
import "./MenuPrincipal.css";
import { firebase, googleAuthProvider } from "../../database/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";


function MenuPrincipal() {
  const navigate = useNavigate();
  const handlreDatosRecorridos = (e) =>{
    navigate('/datos-recorridos');    

  }
  const opciones = [
    {
      imagen: 'https://images.unsplash.com/photo-1559235270-2df4dcfb4eca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjh8fGNpY2xpc21vfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      descripcion: 'Registra recorrido',
      enlace:"/recorrido"
    },
    {
      imagen: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1115&q=80',
      descripcion: 'Datos de recorridos',
      enlace:"/datos-recorridos"
    },
    {
      imagen: 'https://images.unsplash.com/photo-1604357209793-fca5dca89f97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
      descripcion: 'Buscar la mejor ruta',
      enlace:"/datos-recorridos"
    },
    {
      imagen: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1115&q=80',
      descripcion: 'Foto denuncia',
      enlace:"/datos-recorridos"
    },
    {
      imagen: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1631&q=80',
      descripcion: 'Ver mis recorridos en mapa',
      enlace:"/recorridos-mapa"
    },
  ];
  const handleEnlace=(enlace)=>{
    navigate(enlace)
  }
  return (
    
    <div id="menu-principal">
       <h1>MENU PRINCIPAL</h1>
       {/* <button onClick={handlreDatosRecorridos}>Datos recorridos</button> */}


       <div className="menu-container">
      {/* Iterar sobre arreglo de opciones */}
      {opciones.map((opcion, index) => (
        <div key={index} className="opcion" onClick={() =>handleEnlace(opcion.enlace)}>
          <img src={opcion.imagen} alt={`Opción ${index + 1}`} />
          <p>{opcion.descripcion}</p>
        </div>
      ))}
    </div>
    </div>
  );
}

export default MenuPrincipal;
