import React, { useEffect, useState } from "react";
import { UserData } from "../../aux/DataAux";
import LineChartHistoricalDates from "../LineChartHistoricalDates/LineChartHistorialDates";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker } from "@material-ui/pickers";
const DatosRecorridos = () => {
  let fecha = "01-04-2023";
  let distancia = "10";
  const [registros, setRegistros] = useState([]);
  let [activarRangoPersonalizado, setActivarRangoPersonalizado] = useState(
    false
  );
  let [fechaFinal, setFechaFinal] = useState(new Date(Date.parse("2023-04-01")));
  let [fechaInicial, setFechaInicial] = useState(new Date(Date.parse("2023-03-20")));

  const agregarRegistro = () => {
    setRegistros([...registros, { fecha, distancia }]);
  };
  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.date),
    datasets: [
      {
        label: "Recorridos",
        data: UserData.map((data) => data.distance),
        backgroundColor: UserData.map(() => "rgb("+(Math.random()*254)+1+","+(Math.random()*254)+1+","+(Math.random()*254)+1+")"),
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  const handleTimeRange = (e) => {
    console.log("time range changed ");
    console.log(e.target.value);
    switch (e.target.value) {
      case "personal":
        setActivarRangoPersonalizado(true);
        break;
      case "week":
        let hoy = new Date();
        let haceUnaSemana = new Date(hoy);
        haceUnaSemana.setDate(haceUnaSemana.getDate() - 7);
        setFechaInicial(haceUnaSemana);
        setFechaFinal(hoy);
        setActivarRangoPersonalizado(false);
        break;
      case "month":
        const hoy2= new Date();
        let mesAnterior = new Date(hoy2); 
        mesAnterior.setMonth(mesAnterior.getMonth() - 1);
        setFechaInicial(mesAnterior);
        setFechaFinal(hoy2);
        setActivarRangoPersonalizado(false);
        break;
    }
  };
  useEffect(() => {
    setUserData(
      {
        labels: UserData.map((data) => {
          let fechas = [];
          const fecha = new Date(Date.parse(data.date));
          console.log(fecha)
          console.log(fechaInicial)
          console.log(fechaFinal)

          if (fecha >= fechaInicial && fecha <= fechaFinal) {
            return (data.date)
          }
        }),
        datasets: [
          {
            label: "Recorridos",
            data: UserData.map((data) => {
              let fechas = [];
              const fecha = new Date(Date.parse(data.date));
              if (fecha >= fechaInicial && fecha <= fechaFinal) {
                return (data.distance)
              }
            }),

            backgroundColor: UserData.map(() => "rgb("+(Math.random()*254)+1+","+(Math.random()*254)+1+","+(Math.random()*254)+1+")"),
            borderColor: "black",
            borderWidth: 2,
          },
        ],
        
      }
    )
  }, [fechaInicial,fechaFinal]);
  const handleChangeFechaFinal = (e) => {
    console.log(e);
    setFechaFinal(e);
  };
  const handleChangeFechaInicial = (e2) => {
    console.log(e2);
    setFechaInicial(e2);
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
              <td>{registro.fecha}</td>
              <td>{registro.distancia + " km"}</td>
              <td>" "</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <select name="choice" onChange={handleTimeRange}>
          <option value="week">Ultima semana</option>
          <option value="month" selected>
            Ultimo mes
          </option>
          <option value="personal">Rango personal</option>
        </select>
        {activarRangoPersonalizado ? (
          <div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              {/* <Field
                        autoOk
                        component={TimePicker}
                        id="tiempoInicio"
                        name="tiempoInicio"
                        value={values.tiempoInicio}
                        invalidDateMessage=""
                        placeholder=""
                        ampm={false}
                        onChange={
                          value => { setFieldValue("tiempoInicio", value) }
                        } /> */}
              <DatePicker
                value={fechaInicial}
                onChange={handleChangeFechaInicial}
              />
              <DatePicker
                value={fechaFinal}
                onChange={handleChangeFechaFinal}
              />
            </MuiPickersUtilsProvider>
          </div>
        ) : (
          <div></div>
        )}
        <div>
          <LineChartHistoricalDates chartData={userData} />
        </div>
      </div>
    </div>
  );
};

export default DatosRecorridos;
