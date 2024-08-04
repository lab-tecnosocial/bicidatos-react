import React, { createContext, useReducer, useContext } from 'react';

// Define your initial state here
const initialState = {
    places: [],
    selectedPlace: null,
    placePreviewsIsVisible: false,
    placeFormIsVisible: false,
    prePlacePosition: null,
};

// Define your reducer cases here
const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_SELECTED_PLACE':
            return { ...state, selectedPlace: action.payload };
        case 'SET_PLACE_PREVIEW_VISIBILITY':
            return { ...state, placePreviewsIsVisible: action.payload };
        case 'SET_PLACE_FORM_VISIBILITY':
            return { ...state, placeFormIsVisible: action.payload };
        case 'SET_PRE_PLACE_LOCATION':
            return { ...state, prePlacePosition: action.payload };
        case 'ADD_NEW_PLACE':
            return { ...state, places: [...state.places, action.payload] };
        default:
            return state;
    }
};

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);