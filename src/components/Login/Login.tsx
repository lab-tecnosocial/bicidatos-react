import React, { useState } from "react";
import "./Login.css";
import { firebase, googleAuthProvider } from "../../database/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { guardarUsuario } from '../../aux/action';


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  const handleSubmit = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithPopup(googleAuthProvider)
      .then((value) => {
        console.log(value);
        console.log("DISPATCH LOGIN-------------------------------------------------------------------------------------------------------")
        dispatch(guardarUsuario((value.user)));
        // dispatch( {
        //     type: 'SET_USER',
        //     payload: JSON.stringify(user),
        //   });
          navigate('/datosPersonales');    

      });
  };

  return (
    <div id="login">
      <form onSubmit={handleSubmit}>
        {/* <label>
          Correo electrónico:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Contraseña:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label> */}
        <button type="submit">Iniciar sesión con google</button>
      </form>
    </div>
  );
}

export default Login;
