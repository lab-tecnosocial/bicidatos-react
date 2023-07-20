import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { AccountCircle, ExitToApp, Home } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';

import Sidebar from '../Sidebar/Sidebar';
import firebase from 'firebase';
import { googleAuthProvider } from '../../database/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { guardarUsuario } from '../../auxiliar/action';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container } from '@material-ui/core';
import { ExitStatus } from 'typescript';



export default function Header(props) {
  const user = useSelector((state: any) => {
    console.log(user);
    return state.userReducer.user;
  });
  const dispatch = useDispatch();
  let [logeo, setLogeo] = useState(false);
  const [showSessionMessage, setShowSessionMessage] = useState(false)
  const navigate = useNavigate();
  const signInWithGoogle = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((value) => {
        console.log(value);
        console.log("DISPATCH LOGIN-------------------------------------------------------------------------------------------------------")
        setLogeo(true);
        setShowSessionMessage(true);
        props.setLog(true);
        dispatch(guardarUsuario((value.user)));
        navigate('/menu-principal');
      });
  };


  const signOut = async () => {
    firebase.auth().signOut();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.localStorage.removeItem("firebase:authUser");
    }
    setLogeo(false);
    props.setLog(false);
  }
  const handleToggleSidebar = () => {
    props.setIsSidebarVisible(!props.isSidebarVisible);
  };

  useEffect(() => {
    console.log('timer');
    let timer: any;
    if (showSessionMessage) {
      timer = setTimeout(() => {
        setShowSessionMessage(false);
      }, 5000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [showSessionMessage]);

  return (
    <div>
      <AppBar position="static" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar style={{ justifyContent: 'space-between' }}>
            {!logeo ?
              <IconButton href="https://bicidatos.org/" edge="start" color="inherit" aria-label="menu" style={{ width: "auto" }}>
                <Home />
              </IconButton>
              :
              <>
                <IconButton onClick={handleToggleSidebar} edge="start" color="inherit" aria-label="menu" style={{ width: "auto" }}>
                  <MenuIcon />
                </IconButton>
              </>}

            <Typography variant="h6" >
              BiciDatos
            </Typography>
            {
              logeo ? (
                <>
                  <Button onClick={signOut} startIcon={<ExitToApp />} color="inherit">
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <Button onClick={signInWithGoogle} startIcon={<AccountCircle />} color="inherit">
                  Iniciar sesión
                </Button>
              )
            }
          </Toolbar>
        </Container>
      </AppBar>
      {showSessionMessage && (
        <div style={{ backgroundColor: "#A0C49D", color:"#fff", padding: "10px", textAlign: "center" }}>
          <Typography variant="subtitle1" color="inherit">
            Sesión iniciada correctamente. ¡Bienvenido/a, {user.displayName}!
          </Typography>
        </div>
      )}
    </div>
  );


}

