import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router';
import AppRoutes from './routes.tsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  </React.StrictMode>,
);
