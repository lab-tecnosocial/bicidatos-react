import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import { Container } from '@material-ui/core';
import Sidebar from '../Sidebar/Sidebar';
import firebase from 'firebase';
import { googleAuthProvider } from '../../database/firebase';
import { useDispatch } from 'react-redux';
import { guardarUsuario } from '../../aux/action';
import { useNavigate } from 'react-router-dom';
import {useState} from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1
  },
  header: {
    backgroundColor: '#15C0EA',
  }
}));

export default function Header(props) {
  const dispatch = useDispatch();
  let [logeo,setLogeo]=useState(false);
const navigate= useNavigate();
  const signInWithGoogle = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithPopup(googleAuthProvider)
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
    setLogeo(false);
      props.setLog(false);
  }
  const classes = useStyles();
  const handleToggleSidebar = () => {
    props.setIsSidebarVisible(!props.isSidebarVisible);
  };
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.header} elevation={0}>
        <Container maxWidth="lg">
          <Toolbar>
            {!logeo?
            <IconButton href="https://bicidatos.org/" edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
               <HomeIcon />
            </IconButton>
            :
            <>
            <IconButton onClick={handleToggleSidebar} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
               <MenuIcon />
            </IconButton>
            </>}
           
            <Typography variant="h6" className={classes.title} >
              BiciDatos
            </Typography>
            {
            logeo ? <Button size="small" onClick={signOut} variant="outlined" style={{ fontSize: '0.7rem' }} >Cerrar sesión</Button> :
              <Button size="small" onClick={signInWithGoogle} variant="outlined" style={{ fontSize: '0.7rem' }} >Iniciar sesión</Button>
            }
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
