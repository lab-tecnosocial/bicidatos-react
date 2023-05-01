import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { AccountCircle, Home } from '@material-ui/icons';


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
        {
          user ? <Button onClick={signOut} startIcon={<AccountCircle />} color='inherit'>Cerrar sesión</Button> : <Button onClick={signIn} startIcon={<AccountCircle />} color='inherit'>Iniciar sesión</Button>
        }
      </Toolbar>
    </AppBar>

  );


}

