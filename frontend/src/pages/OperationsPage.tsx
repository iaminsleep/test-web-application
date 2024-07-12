import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchOperations, setCurrentPage, setFilter, restoreOperations, resetSavedOperations, clearError, closeAlert } from '../redux/operationsSlice';
import OperationsList from '../components/OperationsList';
import { Pagination, TextField, Box, Button, Snackbar, Alert } from '@mui/material';

const OperationsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { currentPage, totalPages, savedOperations, error, openAlert, filters } = useSelector((state: RootState) => state.operations);

    const [nameFilter, setNameFilter] = useState(filters.name || '');
    const [numberFilter, setNumberFilter] = useState(filters.number || '');
    const [deleted, setDeleted] = useState(filters.deleted || false);

    useEffect(() => {
        if (savedOperations.length === 0) {
            dispatch(fetchOperations({page: currentPage}));
        } else {
            dispatch(restoreOperations());
        }
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [dispatch, currentPage, savedOperations.length]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        dispatch(resetSavedOperations());
        dispatch(setCurrentPage(page));
    };

    const handleNameFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameFilter(event.target.value);
    };

    const handleNumberFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumberFilter(event.target.value);
    };

    const applyFilters = () => {
        dispatch(setFilter({ name: nameFilter, number: numberFilter, deleted: deleted }));
        dispatch(fetchOperations({page: currentPage}));
    };

    const redirectToCreatePage = () => {
        navigate('/operations/create');
    };

    const redirectToRecycleBin = () => {
        navigate('/recycleBin');
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(closeAlert());
        dispatch(clearError());
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={redirectToCreatePage}>Create Operation</Button>
            </div>
            <Box mb={2}>
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
                <label>
                    <input
                        type="checkbox"
                        checked={deleted}
                        onChange={(e) => setDeleted(e.target.checked)}
                        style={{marginRight: '5px'}}
                    />
                    Show Deleted
                </label>
                <Button onClick={applyFilters}>Apply filters</Button>
            </Box>
            <OperationsList/>
            <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
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

export default OperationsPage;