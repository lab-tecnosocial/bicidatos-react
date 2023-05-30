import firebase from "firebase/app"
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyClsDMcq034MPQ2K22jhV0j3X_fRLG2MeU",
  authDomain: "bicidatos-desarrollo.firebaseapp.com",
  projectId: "bicidatos-desarrollo",
  storageBucket: "bicidatos-desarrollo.appspot.com",
  messagingSenderId: "338289917895",
  appId: "1:338289917895:web:03b4f3299e6580c691a3e2",
  measurementId: "G-1KFMFSLYWJ",
};

firebase.initializeApp(firebaseConfig);
const db=firebase.firestore();


export const storageRef = firebase.storage();
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth =firebase.auth();

export const googleAuthProvider=new firebase.auth.GoogleAuthProvider();

export {firebase};

export default db;


