import L from 'leaflet';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents,GeoJSON } from 'react-leaflet';
import polyline from 'google-polyline';

function OpcionesRecorridos() {
  const [startPoint, setStartPoint] = useState<any>([0,0]);
  const [endPoint, setEndPoint] = useState<any>([0,0]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const getRoutes = async () => {
      const url = 'https://corsproxy.io/?' + encodeURIComponent(`https://maps.googleapis.com/maps/api/directions/json?origin=${startPoint[0]},${startPoint[1]}&destination=${endPoint[0]},${endPoint[1]}&key=AIzaSyDH5mVQYzq-GBSai1f7USSNlAU3jpSnVQc&alternatives=true`);
      // const response = await fetch(
      //   `https://maps.googleapis.com/maps/api/directions/json?origin=${startPoint[0]},${startPoint[1]}&destination=${endPoint[0]},${endPoint[1]}&key=AIzaSyDH5mVQYzq-GBSai1f7USSNlAU3jpSnVQc&alternatives=true`,{
      //     headers : {
      //       "Access-Control-Allow-Headers": "*",
      //       "Access-Control-Allow-Origin": "*",
      //       "Access-Control-Allow-Methods": "*",    
      //   }    
      //   }
        
      // );
      const response = await fetch(url);
      console.log("RESPONSE-----------------------------------------------------------------------------------------------------")
      console.log(response);
      const data = await response.json();
      console.log(data.routes);
      setRoutes(data.routes);

      // if (data.routes) {
      //   const routesCoordinates = data.routes.map((route) =>
      //     route.overview_polyline.points
      //   );
      //   setRoutes(routesCoordinates);
      // }
    };

    if (startPoint[0] && endPoint[0]) {
      getRoutes();
    }
  }, [startPoint, endPoint]);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    const coordinates = [lat, lng];

    if (!startPoint[0]) {
      setStartPoint(coordinates);
    } else if (!endPoint[0]) {
      setEndPoint(coordinates);
    } else {
      setStartPoint(coordinates);
      setEndPoint([]);
    }
  };



  const MarkerStart = () => {

    const map = useMapEvents({
        click(e) {                                
            setStartPoint([
                e.latlng.lat,
                e.latlng.lng
            ]);                
        },            
    })

    return (
        startPoint ? 
            <Marker           
            key={startPoint[0]}
            position={startPoint}
            interactive={false} 
            />
        : null
    )   
  }
    const MarkerEnd = () => {

      const map = useMapEvents({
          click(e) {                                
              setEndPoint([
                  e.latlng.lat,
                  e.latlng.lng
              ]);                
          },            
      })
  
      return (
          endPoint ? 
              <Marker           
              key={endPoint[0]}
              position={endPoint}
              interactive={false} 
              />
          : null
      )   
    
}
let polilineas: any = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        description:
          "Ciclovía construida en 1996 que recorre alrededor de la Laguna Alalay, un puente, y sobre un canal de riego bordea el Cerro de San Pedro y sigue una cuadra al norte de la Avenida América terminando en el Parque Wiracocha",
        name: "Ciclovía Norte-Este",
      },
      geometry: {
        type: "MultiLineString",
        coordinates: [],
      },
    },
  ],
};
  return (
    <div className="App">
      <h1>Selecciona un punto de partida y un punto de destino</h1>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MarkerStart />
        <MarkerEnd/>
        {/* {startPoint[0] && <MarkerStart />}
        {endPoint[0] && <MarkerEnd/>} */}
        {routes.map((route, index) => {
          // console.log(polyline.decode(route.overview_polyline.points))
          // <Polyline
          //   key={index}
          //   positions={polyline.decode(route).getLatLngs()}
          //   color="blue"
          // />

          polilineas.features[0].geometry.coordinates=[];
          let coordenadas=polyline.decode(route.overview_polyline.points)
          polilineas.features[0].geometry.coordinates.push(coordenadas);

          console.log(polilineas);
          return (<GeoJSON data={polilineas} style={{color:"blue"}}/>)
          })}
      </MapContainer>
    </div>
  );
}

export default OpcionesRecorridos;