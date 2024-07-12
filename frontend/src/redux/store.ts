// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import operationsReducer from './operationsSlice';
import suboperationsReducer from './suboperationsSlice';

export const store = configureStore({
    reducer: {
        operations: operationsReducer,
        suboperations: suboperationsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;