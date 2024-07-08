import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPagination } from '../redux/operationsSlice';
import { RootState } from '../redux/store';
import { Pagination as MuiPagination } from '@mui/material';

const Pagination: React.FC = () => {
  const dispatch = useDispatch();
  const { page, limit, total } = useSelector((state: RootState) => state.operations.pagination);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setPagination({ page: value }));
  };

  return (
    <MuiPagination
      count={Math.ceil(total / limit)}
      page={page}
      onChange={handleChange}
      color="primary"
      style={{ marginTop: '20px' }}
    />
  );
};

export default Pagination;