import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { auth, provider } from "../../database/firebase";
import Logo from '../../assets/images/logo.png';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import { Container } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textAlign:'center',
  },
  header: {
    backgroundColor: '#15C0EA',
  },
  signInWithGoogle:{

  },
signOut:{
  
}
}));
const signInWithGoogle = async () => {
  try {
    await auth.signInWithPopup(provider)
  }
  catch (error) {
    console.log(error);
  }
}

const signOut = async () => {
  auth.signOut();
}
const [user,setUser]=useState(null);
  if(user){
     // console.log(user);
  } else {
    // console.log(null);
  }
  useEffect(() => {
    auth.onAuthStateChanged(persona => {
      if (persona) {
        setUser(persona);
      } else {
        setUser(null);
      }
    });
  })

export default function Header() {
  const classes = useStyles();

  

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.header} elevation={0}>
        <Container maxWidth="lg">
          <Toolbar>
            <IconButton href="https://bicidatos.org/" edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <HomeIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title} >
              <img src={Logo} width='80px' height='60 px'/>
            </Typography>

            {
            user ? <Button  onClick={signOut} className={classes.signOut} variant="text" endIcon={<AccountCircleIcon />} >Cerrar sesión</Button> :
              <Button  onClick={signInWithGoogle} className={classes.signInWithGoogle} variant="text" endIcon={<ExitToAppIcon />} >Iniciar sesión</Button>
            }

          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
