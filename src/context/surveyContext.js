import React, { createContext, useReducer } from 'react';
import { ADD_SURVEY, FAIL, LOAD_SURVEY, REQUEST, SUCCESS } from 'src/constants/actionTypes';

export const SurveyContext = createContext();

const initialState = [];

const surveyReducer = (state, { type, payload }) => {
  switch (type) {
    case 'ADD_SURVEY':
      return [...state, payload];

    default:
      return state;
  }
};

const SurveyProvider = ({ children }) => {
  const [survey, dispatchSurvey] = useReducer(surveyReducer, initialState);
  return (
    <SurveyContext.Provider value={{ survey, dispatchSurvey }}>{children}</SurveyContext.Provider>
  );
};

export default SurveyProvider;
