import React, { useEffect, useState } from "react";
import { UserData } from "../../aux/DataAux";
import LineChartHistoricalDates from "../LineChartHistoricalDates/LineChartHistorialDates";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker } from "@material-ui/pickers";
import "./DatosRecorridos.css";
import { useSelector } from "react-redux";
import db from "../../database/firebase";



const DatosRecorridos = () => {

  const user = useSelector((state:any) => {
    return state.userReducer.user;
  });;
  console.log("MOSTRANDO COUNTER-------------------------------------------------------------------------------------------------")

  let fecha = "01-04-2023";
  let distancia = "10";
  let datosEncontradosRecorridos = [];
  let [recorridos, setRecorridos] = useState([]);


  let [promedioRecorridos, setPromedioRecorridos] = useState(0);
  let [promedioTiempos, setPromedioTiempos] = useState(0);
  useEffect(() => {
    console.log(user);
    const obtenerUsuarios = async () => {
      const snapshot = await db
        .collection("recorridos")
        .where("UIDUsuario", "==", user.uid);
      snapshot.get().then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          console.log(doc.id);
          console.log(doc.data());
          const historial = await db
            .collection("recorridos")
            .doc(doc.id)
            .collection("historial").orderBy('fecha', 'asc');
          historial.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log(doc);
              console.log(doc.data());
              datosEncontradosRecorridos.push(doc.data());
            });

            setRecorridos(datosEncontradosRecorridos);
            calcularPromedioRecorridos()
            calcularPromedioTiempos()
            
          });
        });
      });
    };
    obtenerUsuarios();
  }, []);
  const calcularPromedioRecorridos = () => {
    let sumaRecorrido=0;
    for (let i = 0; i < datosEncontradosRecorridos.length; i++) {
      sumaRecorrido += datosEncontradosRecorridos[i].distanciaKilometros;
    }
    const promedioRecorrido = sumaRecorrido / datosEncontradosRecorridos.length;
    setPromedioRecorridos(promedioRecorrido);

  };
  const calcularPromedioTiempos = () => {
    let sumaRecorrido=0;
    for (let i = 0; i < datosEncontradosRecorridos.length; i++) {
      sumaRecorrido += datosEncontradosRecorridos[i].tiempoHoras;
    }
    const promedioH = sumaRecorrido / datosEncontradosRecorridos.length;
    setPromedioTiempos(promedioH)
  };
  const [registros, setRegistros] = useState([]);
  let [activarRangoPersonalizado, setActivarRangoPersonalizado] = useState(
    false
  );
  let [fechaFinal, setFechaFinal] = useState(
    new Date(Date.parse("2023-04-01"))
  );
  let [fechaInicial, setFechaInicial] = useState(
    new Date(Date.parse("2023-03-20"))
  );

  const agregarRegistro = () => {
    setRegistros([...registros, { fecha, distancia }]);
  };
  useEffect(() => {
    console.log(UserData);
    setRegistros(UserData);
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
        const hoy2 = new Date();
        let mesAnterior = new Date(hoy2);
        mesAnterior.setMonth(mesAnterior.getMonth() - 1);
        setFechaInicial(mesAnterior);
        setFechaFinal(hoy2);
        setActivarRangoPersonalizado(false);
        break;
    }
  };
  const convertirFormatoFecha= (data:any) => {

    const date = data.fecha.toDate(); 
    const day = date.getDate().toString().padStart(2, "0"); 
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); 
    const year = date.getFullYear(); 
    return `${year}-${month}-${day}`; 

  };
  const [userData, setUserData] = useState({
    labels: recorridos.map((data) => {
      let fechas = [];
      const fecha = new Date(Date.parse(data.date));
      console.log(fecha);
      console.log(fechaInicial);
      console.log(fechaFinal);

      if (new Date(data.fecha.toDate()) >= fechaInicial && new Date(data.fecha.toDate()) <= fechaFinal) {
        return convertirFormatoFecha(data);
      }
    }),
    datasets: [
      {
        label: "Recorridos",
        data: recorridos.map((data) => {
          if (new Date(data.fecha.toDate()) >= fechaInicial && new Date(data.fecha.toDate()) <= fechaFinal) {
            return data.distanciaKilometros;
          }
        }),

        backgroundColor: recorridos.map(
          () =>
            "rgb(" +
            Math.random() * 254 +
            1 +
            "," +
            Math.random() * 254 +
            1 +
            "," +
            Math.random() * 254 +
            1 +
            ")"
        ),
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  useEffect(() => {
    // console.log("FECHA CAMBIADA--------------------------------------------------------")
    // recorridos.map((data) => {
    //   console.log(data);
    //   if (new Date(data.fecha.toDate()) >= fechaInicial && new Date(data.fecha.toDate()) <= fechaFinal) {
    //     console.log("imprime");
    //   }
    // })
    establecerDatosEnGraficaEstadistica()
  }, [fechaInicial, fechaFinal]);
  function establecerDatosEnGraficaEstadistica(){
    setUserData({
      labels: recorridos.map((data) => {
        let fechas = [];
        const fecha = new Date(Date.parse(data.date));
        console.log(fecha);
        console.log(fechaInicial);
        console.log(fechaFinal);

        if (new Date(data.fecha.toDate()) >= fechaInicial && new Date(data.fecha.toDate()) <= fechaFinal) {
          return convertirFormatoFecha(data);
        }
      }),
      datasets: [
        {
          label: "Recorridos",
          data: recorridos.map((data) => {
            if (new Date(data.fecha.toDate()) >= fechaInicial && new Date(data.fecha.toDate()) <= fechaFinal) {
              return data.distanciaKilometros;
            }
          }),

          backgroundColor: recorridos.map(
            () =>
              "rgb(" +
              Math.random() * 254 +
              1 +
              "," +
              Math.random() * 254 +
              1 +
              "," +
              Math.random() * 254 +
              1 +
              ")"
          ),
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    });
  }
  const handleChangeFechaFinal = (e) => {
    console.log(e);
    setFechaFinal(e);
  };
  const handleChangeFechaInicial = (e2) => {
    console.log(e2);
    setFechaInicial(e2);
  };

  return (
    <div id="datos-recorridos-div">
      <div className="profile">
        <img
          src="profile-picture.jpg"
          alt="Foto de perfil"
          // srcSet="https://thumbs.dreamstime.com/z/s%C3%ADmbolo-de-perfil-masculino-inteligente-retrato-estilo-caricatura-m%C3%ADnimo-166146967.jpg"
          srcSet={user.photoURL}
        />

        <table>
          <tr>
            <th>Nombre:</th>
            <td>{user.displayName}</td>
          </tr>
          {/* <tr>
            <th>Edad:</th>
            <td>25</td>
          </tr> */}
          <tr>
            <th>Correo electrónico:</th>
            <td>{user.email}</td>
          </tr>
          <tr>
            <th>Promedio recorridos:</th>
            <td>{promedioRecorridos.toFixed(1)} km</td>
          </tr>
          <tr>
            <th>Promedio tiempos</th>
            <td>{promedioTiempos.toFixed(1)} hrs</td>
          </tr>
        </table>
      </div>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Distancia</th>
            <th>Tiempo</th>
          </tr>
        </thead>
        <tbody>
          {recorridos.map((data, index) => {
            console.log(
              "COLOCANDO DATA-------------------------------------------------------------------------------------"
            );
            console.log(new Date(data.fecha.toDate()))
            const formattedDate = convertirFormatoFecha(data);

            return (
              <tr key={index}>
                <td>{formattedDate}</td>
                <td>{data.distanciaKilometros} km</td>
                <td>{data.tiempoHoras} hrs</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* <button onClick={agregarRegistro}>Agregar registro</button> */}
      <select name="choice" onChange={handleTimeRange}>
        <option value="week">Ultima semana</option>
        <option value="month" selected>
          Ultimo mes
        </option>
        <option value="personal">Rango personal</option>
      </select>
      <div>
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
