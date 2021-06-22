import firebase from "firebase/app"
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBIuPb2AoFPhldY2IHU8blPjEOtIPSlcIE",
  authDomain: "bicidatos-27f70.firebaseapp.com",
  databaseURL: "https://bicidatos-27f70-default-rtdb.firebaseio.com",
  projectId: "bicidatos-27f70",
  storageBucket: "bicidatos-27f70.appspot.com",
  messagingSenderId: "599460388932",
  appId: "1:599460388932:web:8894895998f3bcc7f59c11",
  measurementId: "G-YHTTPP449B"
};
  
firebase.initializeApp(firebaseConfig);
const db=firebase.firestore();
export const storageRef = firebase.storage();
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth =firebase.auth();
export default db;
