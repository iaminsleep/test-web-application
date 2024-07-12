// src/components/CreateOperation.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createOperation } from '../redux/operationsSlice';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { fetchOperations } from '../redux/operationsSlice';
import { saveOperations } from '../redux/operationsSlice';

const CreateOperation: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [name, setName] = useState('');

    const { currentPage } = useSelector((state: RootState) => state.operations);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(createOperation(name));
        setName('');
        navigate('/');
        dispatch(fetchOperations({page: currentPage}));
    };

    const handleBackClick = () => {
        dispatch(saveOperations());
        navigate('/');
    };

    return (
        <Box>
            <Typography variant="h4">Create Operation</Typography>
            <Button onClick={handleBackClick} variant="contained" color="primary">
                Back
            </Button>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary">
                    Create
                </Button>
            </form>
        </Box>
    );
};

export default CreateOperation;