import React, { StrictMode } from 'react'; // Import React
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ReactFlowProvider } from '@xyflow/react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  </StrictMode>
);