import { combineReducers } from '@reduxjs/toolkit';
import operationsReducer from './operationsSlice';

export const rootReducer = combineReducers({
  operations: operationsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;