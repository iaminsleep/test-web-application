import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import OperationsPage from './pages/OperationsPage';
import OperationDetails from './pages/OperationsDetails';
import CreateOperation from './pages/CreateOperation';
import EditOperation from './pages/EditOperation';
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
                    <Route path="/operations/create" element={<CreateOperation />} />

                    <Route path="/operations/:uuid" element={<OperationDetails />} />
                    <Route path="/operations/:uuid/edit" element={<EditOperation />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;
