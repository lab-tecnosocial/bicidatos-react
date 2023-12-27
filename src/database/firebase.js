import firebase from "firebase/app"
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID

};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export const storageRef = firebase.storage();
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default db;
