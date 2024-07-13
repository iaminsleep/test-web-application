// src/components/SuboperationCard.tsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Suboperation } from '../types/operation';

import { deleteSuboperation, forceDeleteSuboperation } from '../redux/suboperationsSlice';
import { IconButton, Box } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

type Props = {
    operationUuid: string;
    suboperation: Suboperation;
    filters: { name?: string; number?: string, deleted?: boolean };
};

const SuboperationCard: React.FC<Props> = ({ operationUuid, suboperation, filters }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSoftDelete = () => {
        dispatch(deleteSuboperation({operationUuid: operationUuid, suboperationUuid: suboperation.uuid}));
    };

    const handleHardDelete = () => {
        dispatch(forceDeleteSuboperation({operationUuid: operationUuid, suboperationUuid: suboperation.uuid}));
    };

    const handleEdit = () => {
        navigate(`suboperations/${suboperation.uuid}/edit`);
    };
    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Name: {suboperation.name}</Typography>
                <Typography variant="subtitle1">Number: {suboperation.number}</Typography>
                <Typography variant="subtitle1">Operation UUID: {suboperation.operation_uuid}</Typography>
                <Typography variant="subtitle2">
                    Created At: {new Date(suboperation.created_at).toLocaleString()}
                </Typography>
                <Typography variant="subtitle2">
                    Updated At: {new Date(suboperation.updated_at).toLocaleString()}
                </Typography>
                <Typography style={{ color: suboperation.deleted_at ? 'red' : 'green' }} variant="subtitle2">
                    Status: {suboperation.deleted_at ? 'Deleted' : 'Not deleted'}
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
            </CardContent>
        </Card>
    );
};

export default SuboperationCard;