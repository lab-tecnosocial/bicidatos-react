import React, { useState } from 'react';

const DatosPersonales= ({ fecha, distancia,tiempo }) =>{
  const [registros, setRegistros] = useState([]);

  const agregarRegistro = () => {
    setRegistros([...registros, { fecha, distancia }]);
  };

  return (
    <div>
      <button onClick={agregarRegistro}>Agregar registro</button>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Distancia</th>
            <th>Tiempo</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro, index) => (
            <tr key={index}>
              <td>{registro.persona}</td>
              <td>{registro.distancia}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DatosPersonales;