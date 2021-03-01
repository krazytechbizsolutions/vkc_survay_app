import React, { createContext, useReducer } from 'react';
import { ADD_IMAGE, FAIL, LOAD_SURVEY, REQUEST, SUCCESS } from 'src/constants/actionTypes';

export const ImageContext = createContext();

const initialState = [];

const ImageReducer = (state, { type, payload }) => {
    switch (type) {
      case 'ADD_IMAGE':
        return [...state, payload];
  
      default:
        return state;
    }
  };

  const ImgProvider = ({ children }) => {
    const [ImgSurvey, dispatchImgSurvey] = useReducer(ImageReducer, initialState);
    return (
      <ImageContext.Provider value={{ ImgSurvey, dispatchImgSurvey }}>{children}</ImageContext.Provider>
    );
  };
  
  export default ImgProvider;