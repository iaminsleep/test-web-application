// src/components/OperationCard.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Operation } from '../types/operation';
import { useNavigate } from 'react-router-dom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { deleteOperation, forceDeleteOperation } from '../redux/operationsSlice';

interface OperationCardProps {
    operation: Operation;
    filters: { name?: string; number?: string, deleted?: boolean };
}

const OperationCard: React.FC<OperationCardProps> = ({ operation, filters }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/operations/${operation.uuid}`);
    };

    const handleSoftDelete = () => {
        dispatch(deleteOperation(operation.uuid));
    };

    const handleHardDelete = () => {
        dispatch(forceDeleteOperation(operation.uuid));
    };

    const handleEdit = () => {
        navigate(`/operations/${operation.uuid}/edit`);
    };
    
    return (
        <Card className="card">
            <CardContent>
                <Typography variant="h5" onClick={handleClick}>
                    {operation.name}
                </Typography>
                <Typography variant="body2" onClick={handleClick}>Number: {operation.number}</Typography>
                <Typography variant="body2" onClick={handleClick}>Created At: {operation.created_at}</Typography>
                <Typography variant="body2" onClick={handleClick}>Updated At: {operation.updated_at}</Typography>
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
            </CardContent>
        </Card>
    );
};

export default OperationCard;