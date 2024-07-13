// src/components/CreateSuboperation.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSuboperation } from '../redux/suboperationsSlice';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const CreateSuboperation: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(createSuboperation({ operationUuid: uuid!, name: name }));
        setName('');
        navigate('/');
    };

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <Box>
            <Typography variant="h4">Create Suboperation</Typography>
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

export default CreateSuboperation;