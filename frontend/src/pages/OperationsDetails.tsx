// src/components/OperationDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Operation } from '../types/operation';
import { CircularProgress, Typography, Button } from '@mui/material';
import { saveOperations } from '../redux/operationsSlice';

const OperationDetails: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const [operation, setOperation] = useState<Operation | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchOperation = async () => {
            try {
                const response = await axios.get(`http://localhost/api/operations/${uuid}`);
                setOperation(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchOperation();
    }, [uuid]);

    const handleBackClick = () => {
        dispatch(saveOperations());
        navigate('/');
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (!operation) {
        return <Typography variant="h6">Operation not found</Typography>;
    }

    return (
        <div>
            <Button onClick={handleBackClick} variant="contained" color="primary">
                Back
            </Button>
            <Typography variant="h4">Name: {operation.name}</Typography>
            <Typography variant="subtitle1">Number: {operation.number}</Typography>
            <Typography variant="subtitle1">
                Created At: {new Date(operation.created_at).toLocaleString()}
            </Typography>
            <Typography variant="subtitle1">
                Updated At: {new Date(operation.updated_at).toLocaleString()}
            </Typography>
        </div>
    );
};

export default OperationDetails;