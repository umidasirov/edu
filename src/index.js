import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AccessProvider } from "./AccessContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AccessProvider>
      <App />
    </AccessProvider>
  </React.StrictMode>
);