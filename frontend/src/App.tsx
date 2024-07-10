import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import OperationsPage from './pages/OperationsPage';
import OperationDetails from './pages/OperationsDetails';

const App: React.FC = () => {
    return (
        <Router>
            <Container>
                <Routes>
                    <Route path="/" element={<OperationsPage />} />
                    <Route path="/operations/:uuid" element={<OperationDetails />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;
