// src/redux/suboperationsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';
import { Suboperation } from '../types/operation';

interface SuboperationsState {
    suboperations: Suboperation[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    openAlert: boolean;
}

const initialState: SuboperationsState = {
    suboperations: [],
    status: 'idle',
    error: null,
    openAlert: false,
};

export const fetchSuboperations = createAsyncThunk(
    'suboperations/fetchSuboperations',
    async (operationUuid: string) => {
        const response = await axios.get(`http://localhost/api/operations/${operationUuid}/suboperations`);
        return response.data;
    }
);

export const createSuboperation = createAsyncThunk(
    'suboperations/createSuboperation',
    async (data: { name: string; operationId: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost/api/suboperations', data );
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const deleteSuboperation = createAsyncThunk(
    'suboperations/deleteSuboperation',
    async ({ suboperationUuid, operationUuid }: { suboperationUuid: string, operationUuid: string }, { rejectWithValue }) => {
        try {
            await axios.delete(`http://localhost/api/operations/${operationUuid}/suboperations/${suboperationUuid}`);
            return suboperationUuid;
        } catch (err: any) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const forceDeleteSuboperation = createAsyncThunk(
    'suboperations/forceDeleteSuboperation',
    async ({ suboperationUuid, operationUuid }: { suboperationUuid: string, operationUuid: string }, { rejectWithValue }) => {
        try {
            await axios.delete(`http://localhost/api/operations/${operationUuid}/suboperations/${suboperationUuid}/force`);
            return suboperationUuid;
        } catch (err: any) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const updateSuboperation = createAsyncThunk(
    'suboperations/updateSuboperation',
    async ({ suboperationUuid, operationUuid, name }: { suboperationUuid: string; operationUuid: string; name: string }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`http://localhost/api/operations/${operationUuid}/suboperations/${suboperationUuid}`, { name });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response.data);
        }
    }
);

const suboperationsSlice = createSlice({
    name: 'suboperations',
    initialState,
    reducers: {
        resetSuboperations(state) {
            state.suboperations = [];
            state.status = 'idle';
            state.error = null;
            state.openAlert = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuboperations.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSuboperations.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.suboperations = action.payload;
            })
            .addCase(fetchSuboperations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Something went wrong';
            })
            .addCase(createSuboperation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createSuboperation.rejected, (state, action) => {
                state.openAlert = true;
                state.error = (action.payload as any)?.error || 'Something went wrong';
            })
            .addCase(createSuboperation.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })

            .addCase(updateSuboperation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateSuboperation.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.suboperations.findIndex(op => op.uuid === action.payload.uuid);
                if (index !== -1) {
                    state.suboperations[index].name = action.payload.name;
                }
            })
            .addCase(updateSuboperation.rejected, (state, action) => {
                state.openAlert = true;
                state.error = (action.payload as any)?.error || 'Something went wrong';
            })
            
            .addCase(deleteSuboperation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteSuboperation.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.suboperations = state.suboperations.filter(op => op.uuid !== action.payload);
            })
            .addCase(deleteSuboperation.rejected, (state, action) => {
                state.status = 'succeeded';
                state.openAlert = true;
                state.error = (action.payload as any)?.error || 'Something went wrong';
            })

            .addCase(forceDeleteSuboperation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(forceDeleteSuboperation.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.suboperations = state.suboperations.filter(op => op.uuid !== action.payload);
            })
            .addCase(forceDeleteSuboperation.rejected, (state, action) => {
                state.status = 'succeeded';
                state.openAlert = true;
                state.error = (action.payload as any)?.error || 'Something went wrong';
            });
    },
});

export const { resetSuboperations } = suboperationsSlice.actions;

export const selectSuboperations = (state: RootState) => state.suboperations;

export default suboperationsSlice.reducer;