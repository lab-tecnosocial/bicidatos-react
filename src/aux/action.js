import { SET_USER } from './store';

export function setUser(user) {
    console.log("SET USER---------------------------------------------------------------------------------------------------------------------------------------")
    console.log(user)
  return {
    type: "SET_USER",
    payload: user,
  };
}