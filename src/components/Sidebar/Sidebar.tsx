import React, { useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import MapIcon from '@material-ui/icons/Map';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import ListIcon from '@material-ui/icons/List';
import { IconBicycle, IconRegisterBicycle, IconRegisterUser, IconRoute } from "../../Icons";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  selected: {
    textDecoration: "underline",
    fontWeight: "bold",
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  listItem: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
  },
}));

const Sidebar = (props) => {
  const [mostrarOU, setMostrarOU] = useState(false);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [selectedItem, setSelectedItem] = useState("menu-principal");

  const handleMostrarOU = () => {
    setMostrarOU(!mostrarOU);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickRegister = () => {
    setOpenRegister(!openRegister);
  }

  const handleListItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="sidebar">
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.root}
      >
        <ListItem 
          button
          className={`${selectedItem === "mapabicidatos" ? classes.selected : ""} ${classes.nested}`}
          onClick={() => handleListItemClick("mapabicidatos")} 
          component={Link}
          to="/mapabicidatos"
        >
          <ListItemIcon>
            <MapIcon />
          </ListItemIcon>
          <ListItemText primary="Mapa" />
        </ListItem>

        <ListItem button onClick={handleClickRegister} className={classes.listItem}>
          <ListItemIcon>
            <IconRegisterBicycle />
          </ListItemIcon>
          <ListItemText primary="Registro" />
          {openRegister ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openRegister} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className={`${selectedItem === "registro-user" ? classes.selected : ""} ${classes.nested}`}
              onClick={() => handleListItemClick("registro-user")}
              component={Link}
              to="/registro-user"
            >
              <ListItemIcon>
                <IconRegisterUser />
              </ListItemIcon>
              <ListItemText primary="Registrar Usuario" />
            </ListItem>

            <ListItem
              button
              className={`${selectedItem === "registro-bici" ? classes.selected : ""} ${classes.nested}`}
              onClick={() => handleListItemClick("registro-bici")}
              component={Link}
              to="/registro-bici"
            >
              <ListItemIcon>
                <IconBicycle />
              </ListItemIcon>
              <ListItemText primary="Registrar Bicicleta" />
            </ListItem>
          </List>
        </Collapse>
        
        <ListItem button onClick={handleClick} className={classes.listItem}>
          <ListItemIcon>
            <IconRoute />
          </ListItemIcon>
          <ListItemText primary="Mis recorridos" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className={`${selectedItem === "menu-principal" ? classes.selected : ""} ${classes.nested}`}
              onClick={() => handleListItemClick("menu-principal")}
              component={Link}
              to="/menu-principal"
            >
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary="Menú principal" />
            </ListItem>
            <ListItem
              button
              className={`${selectedItem === "recorrido" ? classes.selected : ""} ${classes.nested}`}
              onClick={() => handleListItemClick("recorrido")}
              component={Link}
              to="/recorrido"
            >
              <ListItemIcon>
                <SendIcon />
              </ListItemIcon>
              <ListItemText primary="Registrar recorrido" />
            </ListItem>
            <ListItem
              button
              className={`${selectedItem === "datos-recorridos" ? classes.selected : ""} ${classes.nested}`}
              onClick={() => handleListItemClick("datos-recorridos")}
              component={Link}
              to="/datos-recorridos"
            >
              <ListItemIcon>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText primary="Ver mis recorridos" />
            </ListItem>
            <ListItem
              button
              className={`${selectedItem === "recorridos-mapa" ? classes.selected : ""} ${classes.nested}`}
              onClick={() => handleListItemClick("recorridos-mapa")}
              component={Link}
              to="/recorridos-mapa"
            >
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary="Recorridos en mapa" />
            </ListItem>
            <ListItem
              button
              className={`${selectedItem === "opciones-recorridos" ? classes.selected : ""} ${classes.nested}`}
              onClick={() => handleListItemClick("opciones-recorridos")}
              component={Link}
              to="/opciones-recorridos"
            >
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Opciones recorridos" />
            </ListItem>
          </List>
        </Collapse>

      </List>
    </div>
  )
}

export default Sidebar;