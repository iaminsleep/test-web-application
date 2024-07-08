import React from 'react';
import { useDispatch } from 'react-redux';
import { setFilter } from '../redux/operationsSlice';
import { TextField, Button } from '@mui/material';

const OperationFilter: React.FC = () => {
  const dispatch = useDispatch();

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilter({ [event.target.name]: event.target.value }));
  };

  const handleFilterReset = () => {
    dispatch(setFilter({}));
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <TextField label="Number" name="number" onChange={handleFilterChange} style={{ marginRight: '10px' }} />
      <TextField label="Name" name="name" onChange={handleFilterChange} style={{ marginRight: '10px' }} />
      <Button variant="contained" onClick={handleFilterReset}>Reset Filters</Button>
    </div>
  );
};

export default OperationFilter;