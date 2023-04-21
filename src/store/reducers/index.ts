import { combineReducers } from "redux";
import places from "./places";
import userReducer from './userReducer';

export default combineReducers({ places,userReducer });
