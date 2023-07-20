import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


const LineChartHistoricalDates=({ chartData })=> {
  // Configuración de estilos personalizados
  const chartOptions = {
    scales: {
      x: {
        grid: {
          display: false, // Ocultar líneas de la cuadrícula vertical
        },
        ticks: {
          color: "black", // Color de las etiquetas del eje x
          font: {
            size: 12, // Tamaño de fuente de las etiquetas del eje x
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)", // Color de las líneas de la cuadrícula horizontal
        },
        ticks: {
          color: "black", // Color de las etiquetas del eje y
          font: {
            size: 12, // Tamaño de fuente de las etiquetas del eje y
          },
        },
      },
    },
    elements: {
      point: {
        radius: 4, // Tamaño de los puntos en el gráfico
        backgroundColor: "rgba(255, 0, 0, 0.6)", // Color de fondo de los puntos
        borderColor: "rgba(255, 0, 0, 1)", // Color del borde de los puntos
        borderWidth: 2, // Grosor del borde de los puntos
      },
    },
  };
  return <Line data={chartData} options={chartOptions} />;
}

export default LineChartHistoricalDates;