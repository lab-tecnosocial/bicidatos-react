import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { AccountCircle, Home } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';

import Sidebar from '../Sidebar/Sidebar';
import firebase from 'firebase';
import { googleAuthProvider } from '../../database/firebase';
import { useDispatch } from 'react-redux';
import { guardarUsuario } from '../../aux/action';
import { useNavigate } from 'react-router-dom';
import {useState} from 'react';


export default function Header(props) {
  const dispatch = useDispatch();
  let [logeo,setLogeo]=useState(false);
const navigate= useNavigate();
  const signInWithGoogle = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((value) => {
        console.log(value);
        console.log("DISPATCH LOGIN-------------------------------------------------------------------------------------------------------")
        setLogeo(true);
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
  const classes = useStyles();
  const handleToggleSidebar = () => {
    props.setIsSidebarVisible(!props.isSidebarVisible);
  };
  return (
    <div className={classes.root}>
      <AppBar position="static" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar>
            {!logeo?
            <IconButton href="https://bicidatos.org/" edge="start" color="inherit" aria-label="menu" style={{width:"auto"}}>
               <Home />
            </IconButton>
            :
            <>
            <IconButton onClick={handleToggleSidebar} edge="start" color="inherit" aria-label="menu" style={{width:"auto"}}>
               <MenuIcon />
            </IconButton>
            </>}
           
            <Typography variant="h6" className={classes.title} >
              BiciDatos
            </Typography>
            {
            logeo ? <Button size="small" className="button-header" onClick={signOut} variant="outlined" style={{ fontSize: '0.7rem',width:"auto"}} >Cerrar sesión</Button> :
              <Button size="small" className="button-header" onClick={signInWithGoogle} variant="outlined" style={{ fontSize: '0.7rem' }} >Iniciar sesión</Button>
            }
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );


}

