import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RainEffect } from 'react-background-animation'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <RainEffect />
  </React.StrictMode>
);

