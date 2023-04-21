import { createStore } from 'redux';
import { combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";



export const SET_USER = 'SET_USER';

const initialState = {
  user: "",
};
export function reducerUsuario(state = initialState, action) {
    console.log("EN REDUCER------------------------------------------------------------------------------------------------------------------------------------")
    console.log(action.type)
  switch (action.type) {
    case 'SET_USER':
        console.log("SET_USER-------------------------------------------------------------------------------------------------------------")
      return {
        user: action.payload,
      };
    default:
      return state;
  }
}

const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;


const store = createStore(reducerUsuario,  composeEnhancers(applyMiddleware(thunk)));

export default store;
