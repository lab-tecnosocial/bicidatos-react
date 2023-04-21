

export const SET_USER = 'SET_USER';

const initialState: any = {
  user: "",
};
const userReducer = (state: any = initialState, action: { type: string; payload: any }): any => {
  console.log("EN REDUCER------------------------------------------------------------------------------------------------------------------------------------")
  console.log(action.type)
  switch (action.type) {
    case 'SET_USER': {
      console.log("SET_USER-------------------------------------------------------------------------------------------------------------")
      return {
        ...state,
        user: action.payload,
      };
    }
    default:
      return state;
  }
}

export default userReducer;
