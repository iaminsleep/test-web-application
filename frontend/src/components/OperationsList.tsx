// src/components/OperationsList.tsx
import React from 'react';
import { Grid, CircularProgress, Typography } from '@mui/material';
import OperationCard from './OperationCard';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const OperationsList: React.FC = () => {
    const { operations, status, filters } = useSelector((state: RootState) => state.operations);

    if (status === 'loading') {
        return <div style={{ display: 'inline-block', verticalAlign: 'top', alignItems: 'start', width: '1176px', height:'984px', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px'}}><h3>Loading...</h3></div>
            <div style={{ display: 'flex', justifyContent: 'center'}}>
                <CircularProgress />
            </div>
        </div>;
    }

    if (status === 'failed') {
        return <div>
            <Typography variant="h6">Operations not found</Typography>
        </div>
    }

    return (
        <div>
            <Grid container spacing={3}>
                {operations.map((operation) => (
                    <Grid item key={operation.uuid} xs={12} sm={6} md={4}>
                        <OperationCard operation={operation} filters={filters} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default OperationsList;
