import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Operation } from '../types/operation';
import { CircularProgress, Typography } from '@mui/material';

const OperationDetails: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const [operation, setOperation] = useState<Operation | null>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <CircularProgress />;
    }

    if (!operation) {
        return <Typography variant="h6">Operation not found</Typography>;
    }

    return (
        <div>
            <Typography variant="h4">{operation.name}</Typography>
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