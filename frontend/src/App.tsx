import React from 'react';
import OperationList from './components/OperationList';
import { Container, Typography } from '@mui/material';

const App: React.FC = () => {
  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom>
        Operations Admin Panelddfd
      </Typography>
      <OperationList />
    </Container>
  );
};

export default App;