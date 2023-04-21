import { types } from "util";
import {firebase,googleAuthProvider} from "../database/firebase"


export const googleLogin= (id,username)=>{
    return(dispatch)=>{
        firebase.auth().signInWithPopup(googleAuthProvider).then(({user})=>{
            dispatch(login(user.uid,user.displayName))
        });
    }
}

export const login= (id,username)=>{
    return{
        type:types.login,
        payload: {
            id,
            username
        }
    }
}