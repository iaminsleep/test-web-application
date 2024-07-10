import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, CircularProgress, Pagination } from '@mui/material';
import { AppDispatch, RootState } from '../redux/store';
import { fetchOperations, setCurrentPage, selectOperations } from '../redux/operationsSlice';
import OperationCard from './OperationCard';

const OperationsList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { operations, currentPage, totalPages, status } = useSelector((state: RootState) => state.operations);

    useEffect(() => {
        dispatch(fetchOperations(currentPage));
    }, [dispatch, currentPage]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        dispatch(setCurrentPage(page));
    };

    if (status === 'loading') {
        return <CircularProgress />;
    }

    return (
        <div>
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