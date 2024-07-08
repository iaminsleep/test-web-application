import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOperations } from '../redux/operationsSlice';
import { RootState } from '../redux/store';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import OperationFilters from './OperationFilters';
import Pagination from './Pagination';

const OperationList: React.FC = () => {
  const dispatch = useDispatch();
  const { items, loading, error, pagination } = useSelector((state: RootState) => state.operations);

  useEffect(() => {
    dispatch(fetchOperations());
  }, [dispatch, pagination.page, pagination.limit]);

  return (
    <div>
      <OperationFilters />
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>UUID</TableCell>
                <TableCell>Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((operation) => (
                <TableRow key={operation.uuid}>
                  <TableCell>{operation.uuid}</TableCell>
                  <TableCell>{operation.number}</TableCell>
                  <TableCell>{operation.name}</TableCell>
                  <TableCell>{operation.created_at}</TableCell>
                  <TableCell>{operation.updated_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Pagination />
    </div>
  );
};

export default OperationList;