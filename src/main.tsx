import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PRTSErrorBoundary } from './components/PRTSErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PRTSErrorBoundary>
      <App />
    </PRTSErrorBoundary>
  </React.StrictMode>
);
