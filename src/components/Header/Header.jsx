import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { AccountCircle, Home } from '@material-ui/icons';
import { Hidden } from '@material-ui/core';


export default function Header({ user, signIn, signOut }) {


  return (
    <AppBar position="static" elevation={0} >
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <IconButton href="https://bicidatos.org/" edge="start" color="inherit" >
          <Home />
        </IconButton>
        <Typography variant="h6" align='center'>
          BiciDatos
        </Typography>
        <Hidden smUp>
          {user ? (
            <Button onClick={signOut} startIcon={<AccountCircle />} color="inherit">
            </Button>
          ) : (
            <Button onClick={signIn} startIcon={<AccountCircle />} color="inherit">
            </Button>
          )}
        </Hidden>
        <Hidden xsDown>
          {user ? (
            <Button onClick={signOut} color="inherit">
              Cerrar sesión
            </Button>
          ) : (
            <Button onClick={signIn} color="inherit">
              Iniciar sesión
            </Button>
          )}
        </Hidden>
      </Toolbar>
    </AppBar>

  );


}

