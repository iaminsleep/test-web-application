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
    openAlert: boolean;
    filters: { name?: string; number?: string, deleted?: boolean };
    savedOperations: Operation[];
}

const initialState: OperationsState = {
    operations: [],
    currentPage: 1,
    totalPages: 0,
    status: 'idle',
    error: null,
    openAlert: false,
    filters: { deleted: false },
    savedOperations: [],
};

export const fetchOperations = createAsyncThunk(
    'operations/fetchOperations',
    async (params: { page?: number; filters?: { name?: string; number?: string; deleted?: boolean } }, { getState, rejectWithValue }) => {
        try {
            let response;
        
            const state = getState() as RootState;

            const filters = params.filters || state.operations.filters;

            if(filters) {
                const queryParams = new URLSearchParams();
                if (filters.name) queryParams.append('name', filters.name);
                if (filters.number) queryParams.append('number', filters.number);
                if (filters.deleted) queryParams.append('deleted', 'true');
                queryParams.append('page', (params.page || state.operations.currentPage).toString());

                response = await axios.get(`http://localhost/api/operations/search?${queryParams.toString()}`);
            } else {
                response = await axios.get(`http://localhost/api/operations?page=${params.page}`);
            }
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const createOperation = createAsyncThunk(
    'operations/createOperation',
    async (name: string, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost/api/operations', { name: name} );
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const deleteOperation = createAsyncThunk(
    'operations/deleteOperation',
    async (uuid: string, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`http://localhost/api/operations/${uuid}`);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const forceDeleteOperation = createAsyncThunk(
    'operations/forceDeleteOperation',
    async (uuid: string, { rejectWithValue }) => {
        try {
            await axios.delete(`http://localhost/api/operations/${uuid}/force`);
            return uuid;
        } catch (err: any) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const updateOperation = createAsyncThunk(
    'operations/updateOperation',
    async ({ uuid, name }: { uuid: string; name: string }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`http://localhost/api/operations/${uuid}`, { name });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response.data);
        }
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
        resetSavedOperations(state) {
            state.savedOperations = [];
        },
        setCurrentPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        },
        setFilter(state, action: PayloadAction<{ name?: string; number?: string; deleted?: boolean }>) {
            state.filters = action.payload;
        },
        saveOperations(state) {
            state.savedOperations = state.operations;
        },
        restoreOperations(state) {
            state.operations = state.savedOperations;
        },
        clearError(state) {
            state.error = null;
        },
        closeAlert(state) {
            state.openAlert = false;
        }
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
                state.error = (action.payload as any)?.error || 'Something went wrong';
            })

            .addCase(createOperation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createOperation.rejected, (state, action) => {
                state.openAlert = true;
                state.error = (action.payload as any)?.error || 'Something went wrong';
            })
            .addCase(createOperation.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })

            .addCase(updateOperation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateOperation.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.operations.findIndex(op => op.uuid === action.payload.uuid);
                if (index !== -1) {
                    state.operations[index].name = action.payload.name;
                }
            })
            .addCase(updateOperation.rejected, (state, action) => {
                state.openAlert = true;
                state.error = (action.payload as any)?.error || 'Something went wrong';
            })
            
            .addCase(deleteOperation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteOperation.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.operations = state.operations.filter(op => op.uuid !== action.payload);
            })
            .addCase(deleteOperation.rejected, (state, action) => {
                state.status = 'succeeded';
                state.openAlert = true;
                state.error = (action.payload as any)?.error || 'Something went wrong';
            })

            .addCase(forceDeleteOperation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(forceDeleteOperation.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.operations = state.operations.filter(op => op.uuid !== action.payload);
            })
            .addCase(forceDeleteOperation.rejected, (state, action) => {
                state.status = 'succeeded';
                state.openAlert = true;
                state.error = (action.payload as any)?.error || 'Something went wrong';
            });
    },
});

export const { 
    resetOperations, 
    setCurrentPage, 
    setFilter, 
    saveOperations, 
    restoreOperations, 
    resetSavedOperations, 
    clearError, 
    closeAlert 
} = operationsSlice.actions;

export const selectOperations = (state: RootState) => state.operations;

export default operationsSlice.reducer;
