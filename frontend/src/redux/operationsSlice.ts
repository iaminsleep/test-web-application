// src/redux/operationsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';
import { Operation } from '../types/operation';

interface OperationsState {
    operations: Operation[];
    currentPage: number;
    totalPages: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    filter: string;
    savedOperations: Operation[];
}

const initialState: OperationsState = {
    operations: [],
    currentPage: 1,
    totalPages: 0,
    status: 'idle',
    error: null,
    filter: '',
    savedOperations: [],
};

export const fetchOperations = createAsyncThunk(
    'operations/fetchOperations',
    async (page: number = 1, { getState }) => {
        const state = getState() as RootState;
        const response = await axios.get(`http://localhost/api/operations?page=${page}&filter=${state.operations.filter}`);
        return response.data;
    }
);

const operationsSlice = createSlice({
    name: 'operations',
    initialState,
    reducers: {
        resetOperations(state) {
            state.operations = [];
            state.currentPage = 1;
            state.totalPages = 0;
            state.status = 'idle';
            state.error = null;
        },
        setCurrentPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        },
        setFilter(state, action: PayloadAction<string>) {
            state.filter = action.payload;
        },
        saveOperations(state) {
            state.savedOperations = state.operations;
        },
        restoreOperations(state) {
            state.operations = state.savedOperations;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOperations.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOperations.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.operations = action.payload.data;
                state.currentPage = action.payload.current_page;
                state.totalPages = action.payload.last_page;
            })
            .addCase(fetchOperations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Something went wrong';
            });
    },
});

export const { resetOperations, setCurrentPage, setFilter, saveOperations, restoreOperations } = operationsSlice.actions;

export const selectOperations = (state: RootState) => state.operations;

export default operationsSlice.reducer;
