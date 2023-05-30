import { SET_USER } from './store';

export function guardarUsuario(user) {
    console.log("SET USER---------------------------------------------------------------------------------------------------------------------------------------")
    console.log(user)
  return {
    type: "SET_USER",
    payload: user,
  };
}