import React, { useState, useEffect } from 'react';

function Cronometro({time,setTime,isRunning,setIsRunning}) {

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);



  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div>
      <h1>{formatTime(time)}</h1>
    </div>
  );
}

export default Cronometro;