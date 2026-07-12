import React from 'react';
import ReactDOM from 'react-dom/client';
import 'aos/dist/aos.css';
import './index.css';
import './desktop-fixes.css';
import RootApp from './RootApp';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);
