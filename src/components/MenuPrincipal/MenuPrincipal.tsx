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
  return (
    <div>
       <h1>MENU PRINCIPAL</h1>
       <button onClick={handlreDatosRecorridos}>Datos recorridos</button>
    </div>
  );
}

export default MenuPrincipal;
