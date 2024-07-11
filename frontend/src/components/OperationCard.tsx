// src/components/OperationCard.tsx
import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Operation } from '../types/operation';
import { useNavigate } from 'react-router-dom';

interface OperationCardProps {
    operation: Operation;
}

const OperationCard: React.FC<OperationCardProps> = ({ operation }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/operations/${operation.uuid}`);
    };
    
    return (
        <Card className="card">
            <CardContent>
                <Typography variant="h5" onClick={handleClick}>
                    {operation.name}
                </Typography>
                <Typography variant="body2">Number: {operation.number}</Typography>
                <Typography variant="body2">Created At: {operation.created_at}</Typography>
                <Typography variant="body2">Updated At: {operation.updated_at}</Typography>
                <div className="card-actions">
                    <IconButton>
                        <EditIcon />
                    </IconButton>
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </div>
            </CardContent>
        </Card>
    );
};

export default OperationCard;