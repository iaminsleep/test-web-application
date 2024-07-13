// src/components/OperationDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Operation } from '../types/operation';
import { CircularProgress, Typography, Button, Grid } from '@mui/material';
import { saveOperations } from '../redux/operationsSlice';
import { fetchSuboperations, resetSuboperations, selectSuboperations } from '../redux/suboperationsSlice';
import SuboperationCard from '../components/SuboperationCard';

import { deleteOperation, forceDeleteOperation } from '../redux/operationsSlice';

import { IconButton, Box } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { RootState } from '../redux/store';

const OperationDetails: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const [operation, setOperation] = useState<Operation | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { suboperations, status } = useSelector(selectSuboperations);
    const { filters } = useSelector((state: RootState) => state.operations);

    useEffect(() => {
        const fetchOperation = async () => {
            try {
                const response = await axios.get(`http://localhost/api/operations/${uuid}`);
                setOperation(response.data);
                setLoading(false);
                dispatch(fetchSuboperations(uuid!));
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchOperation();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        return () => {
            dispatch(resetSuboperations());
        };
    }, [uuid, dispatch]);

    const handleBackClick = () => {
        dispatch(saveOperations());
        navigate('/');
    };

    const handleSoftDelete = () => {
        dispatch(deleteOperation(operation!.uuid));
    };

    const handleHardDelete = () => {
        dispatch(forceDeleteOperation(operation!.uuid));
    };

    const handleEdit = () => {
        navigate(`/operations/${operation!.uuid}/edit`);
    };

    const redirectToCreatePage = () => {
        navigate(`/operations/${operation!.uuid}/create`);
    };

    if (loading) {
        return <div>
            <Button onClick={handleBackClick} variant="contained" color="primary">
                Back
            </Button>
            <div style={{ display: 'inline-block', verticalAlign: 'top', alignItems: 'start', width: '1176px', height:'984px', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px'}}>
                    <h3>Loading...</h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <CircularProgress />
                </div>
            </div>
        </div>;
    }

    if (!operation) {
        return <div>
            <Button onClick={handleBackClick} variant="contained" color="primary">
                Back
            </Button>
            <Typography variant="h6">Operation not found</Typography>
        </div>
    }

    return (
        <div>
            <Button onClick={handleBackClick} variant="contained" color="primary">
                Back
            </Button>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={redirectToCreatePage}>Create Suboperation</Button>
            </div>
            <div>
                <div style={{ display: 'inline-block', verticalAlign: 'top'}}>
                    <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Operation: </h2>
                    <div className="card" style={{ cursor: 'default', padding: '35px' }}>
                        <Typography variant="h4">UUID: {operation.uuid}</Typography>
                        <Typography variant="subtitle1">Name: {operation.name}</Typography>
                        <Typography variant="subtitle1">Number: {operation.number}</Typography>
                        <Typography variant="subtitle1">
                            Created At: {new Date(operation.created_at).toLocaleString()}
                        </Typography>
                        <Typography variant="subtitle1">
                            Updated At: {new Date(operation.updated_at).toLocaleString()}
                        </Typography>
                        <div className="card-actions">
                        <Box>
                            {filters.deleted === false ? 
                                <IconButton onClick={handleSoftDelete} color="primary">
                                    <DeleteIcon style={{ color: 'green' }} />
                                </IconButton> : ''
                            }
                            <IconButton onClick={handleHardDelete} color="secondary">
                                <DeleteForeverIcon style={{ color: 'red' }} />
                            </IconButton>
                            {filters.deleted === false ? 
                                <IconButton onClick={handleEdit}>
                                    <EditIcon />
                                </IconButton> : ''
                            }
                        </Box>
                    </div>
                    </div>
                    <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Suboperations:</h2>
                    {status === 'loading' ? (
                        <div style={{ display: 'inline-block', verticalAlign: 'top', alignItems: 'start', width: '1176px', height:'984px', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px'}}><h3>Loading...</h3></div>
                            <div style={{ display: 'flex', justifyContent: 'center'}}>
                            <CircularProgress />
                            </div>
                        </div>
                    ) : (
                        <Grid container spacing={3}>
                            {suboperations.map((suboperation) => (
                                <Grid item key={suboperation.uuid} xs={12} sm={6} md={4}>
                                    <SuboperationCard operationUuid={operation.uuid} suboperation={suboperation} filters={filters}/>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OperationDetails;