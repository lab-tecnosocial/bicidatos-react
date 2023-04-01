import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
// import React from 'react';
// import ReactDOM from 'react-dom';
// import { MapContainer } from 'react-leaflet';
// import App from './App';

// ReactDOM.render(
//   <MapContainer center={[51.505, -0.09]} zoom={13} style={{width:"100%",height:"1200px"}}>
//       <App />
//   </MapContainer>,
//   document.getElementById('root'),
// );