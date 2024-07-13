// src/components/EditSuboperation.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateSuboperation, selectSuboperations } from '../redux/suboperationsSlice';
import { TextField, Button, Box, Typography } from '@mui/material';

const EditSuboperation: React.FC = () => {
    const { uuid, suboperationUuid } = useParams<{ uuid: string, suboperationUuid: string }>();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const suboperationsState = useSelector(selectSuboperations);
    const [name, setName] = useState('');

    useEffect(() => {
        const suboperation = suboperationsState.suboperations.find(op => op.uuid === uuid);
        if (suboperation) {
            setName(suboperation.name);
        }
    }, [uuid, name, suboperationsState.suboperations]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(updateSuboperation({ operationUuid: uuid!, suboperationUuid: suboperationUuid!, name: name }));
        navigate('/');
    };

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <Box>
            <Button onClick={handleBackClick} variant="contained" color="primary">
                Back
            </Button>
            <Typography variant="h4">Edit Suboperation</Typography>
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

export default EditSuboperation;