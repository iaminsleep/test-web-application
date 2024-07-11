import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import OperationsPage from './pages/OperationsPage';
import OperationDetails from './pages/OperationsDetails';
import './css/App.css'; // Import CSS file

const App: React.FC = () => {
    return (
        <Router>
            <div className="header">
                <h1>Admin Panel for Operations</h1>
            </div>
            <Container className="container">
                <Routes>
                    <Route path="/" element={<OperationsPage />} />
                    <Route path="/operations/:uuid" element={<OperationDetails />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;
