import db from './firebaseConfig.js';

export const getBiciparqueos = async () => {
  const biciparqueosRef = db.collection('biciparqueos2');
  const snapshot = await biciparqueosRef.get();
  if (snapshot.empty) {
    console.log('No se encontraron biciparqueos.');
    return [];
  }
  let arr = [];
  snapshot.forEach(doc => {
    arr.push(doc.data());
  });
  return arr;
};

export const getServicios = async () => {
  const serviciosRef = db.collection('servicios2');
  const snapshot = await serviciosRef.get();
  if (snapshot.empty) {
    console.log('No se encontraron servicios.');
    return [];
  }
  let arr = [];
  snapshot.forEach(doc => {
    arr.push(doc.data());
  });
  return arr;
};

export const getAforos = async () => {
  const aforosRef = db.collection('aforos2');
  const snapshot = await aforosRef.get();
  if (snapshot.empty) {
    console.log('No se encontraron aforos.');
    return [];
  }
  let arr = [];
  snapshot.forEach(doc => {
    arr.push(doc.data());
  });
  return arr;
};

export const getDenuncias = async () => {
  const denunciasRef = db.collection('denuncias2');
  const snapshot = await denunciasRef.get();
  if (snapshot.empty) {
    console.log('No se encontraron denuncias.');
    return [];
  }
  let arr = [];
  snapshot.forEach(doc => {
    arr.push(doc.data());
  });
  return arr;
};