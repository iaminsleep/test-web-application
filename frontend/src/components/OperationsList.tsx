// src/components/OperationsList.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, CircularProgress, Pagination, TextField, Box } from '@mui/material';
import { AppDispatch, RootState } from '../redux/store';
import { fetchOperations, setCurrentPage, setFilter, restoreOperations } from '../redux/operationsSlice';
import OperationCard from './OperationCard';

const OperationsList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { operations, currentPage, totalPages, status, savedOperations } = useSelector((state: RootState) => state.operations);
    const [filterText, setFilterText] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [numberFilter, setNumberFilter] = useState('');

    useEffect(() => {
        if (savedOperations.length === 0) {
            dispatch(fetchOperations(currentPage));
        } else {
            dispatch(restoreOperations());
        }
    }, [dispatch, currentPage, savedOperations.length]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        dispatch(setCurrentPage(page));
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(event.target.value);
        dispatch(setFilter(event.target.value));
        dispatch(fetchOperations(currentPage));
    };

    const handleNameFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameFilter(event.target.value);
        dispatch(setFilter(event.target.value));
        dispatch(fetchOperations(currentPage));
    };

    const handleNumberFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumberFilter(event.target.value);
        dispatch(setFilter(event.target.value));
        dispatch(fetchOperations(currentPage));
    };

    if (status === 'loading') {
        return <CircularProgress />;
    }

    return (
        <div>
            <Box mb={2}>
                <TextField
                    label="Filter Operations"
                    variant="outlined"
                    fullWidth
                    value={filterText}
                    onChange={handleFilterChange}
                />
                <TextField
                    label="Filter by Name"
                    variant="outlined"
                    fullWidth
                    value={nameFilter}
                    onChange={handleNameFilterChange}
                    style={{ marginTop: '16px' }}
                />
                <TextField
                    label="Filter by Number"
                    variant="outlined"
                    fullWidth
                    value={numberFilter}
                    onChange={handleNumberFilterChange}
                    style={{ marginTop: '16px' }}
                />
            </Box>
            <Grid container spacing={3}>
                {operations.map((operation) => (
                    <Grid item key={operation.uuid} xs={12} sm={6} md={4}>
                        <OperationCard operation={operation} />
                    </Grid>
                ))}
            </Grid>
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                style={{ marginTop: '16px' }}
            />
        </div>
    );
};

export default OperationsList;
