// src/components/EditOperation.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateOperation, selectOperations } from '../redux/operationsSlice';
import { TextField, Button, Box, Typography } from '@mui/material';

import { RootState } from '../redux/store';
import { fetchOperations } from '../redux/operationsSlice';
import { saveOperations } from '../redux/operationsSlice';

const EditOperation: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const { currentPage } = useSelector((state: RootState) => state.operations);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const operationsState = useSelector(selectOperations);
    const [name, setName] = useState('');
    
    useEffect(() => {
        const operation = operationsState.operations.find(op => op.uuid === uuid);
        if (operation) {
            setName(operation.name);
        }
    }, [uuid, operationsState.operations]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(updateOperation({ uuid: uuid!, name: name }));
        navigate('/');
        dispatch(fetchOperations({page: currentPage}));
    };

    const handleBackClick = () => {
        dispatch(saveOperations());
        navigate('/');
    };

    return (
        <Box>
            <Button onClick={handleBackClick} variant="contained" color="primary">
                Back
            </Button>
            <Typography variant="h4">Edit Operation</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary">
                    Save
                </Button>
            </form>
        </Box>
    );
};

export default EditOperation;