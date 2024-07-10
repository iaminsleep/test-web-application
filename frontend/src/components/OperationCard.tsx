import React from 'react';
import { Card, CardContent, Typography, CardActionArea } from '@mui/material';
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
        <Card>
            <CardActionArea onClick={handleClick}>
                <CardContent>
                    <Typography variant="h5">{operation.name}</Typography>
                    <Typography color="textSecondary">
                        Number: {operation.number}
                    </Typography>
                    <Typography color="textSecondary">
                        Created At: {new Date(operation.created_at).toLocaleString()}
                    </Typography>
                    <Typography color="textSecondary">
                        Updated At: {new Date(operation.updated_at).toLocaleString()}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default OperationCard;