import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

interface Operation {
  uuid: string;
  number: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface OperationsState {
  items: Operation[];
  loading: boolean;
  error: string | null;
  filters: {
    [key: string]: any;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: OperationsState = {
  items: [],
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

export const fetchOperations = createAsyncThunk(
  'operations/fetchOperations',
  async (_, { getState }) => {
    const state = getState() as { operations: OperationsState };
    const { filters, pagination } = state.operations;
    const response = await api.get('/operations', {
      params: { ...filters, page: pagination.page, limit: pagination.limit },
    });
    return response.data;
  }
);

const operationsSlice = createSlice({
  name: 'operations',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOperations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOperations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchOperations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch operations';
      });
  },
});

export const { setFilter, setPagination } = operationsSlice.actions;

export default operationsSlice.reducer;