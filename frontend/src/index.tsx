import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './css/index.css'; // Ensure this is created with some basic reset styles

const theme = createTheme();

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);
