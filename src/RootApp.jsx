import React, { useEffect } from 'react';
import App from './App';
import TechnologyPage from './pages/TechnologyPage';

export default function RootApp() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  useEffect(() => {
    if (path !== '/') return undefined;

    const routeTechnology = (event) => {
      const link = event.target.closest('a[href="#technology"]');
      if (!link) return;
      event.preventDefault();
      window.location.assign('/technology');
    };

    document.addEventListener('click', routeTechnology);
    return () => document.removeEventListener('click', routeTechnology);
  }, [path]);

  return path === '/technology' ? <TechnologyPage /> : <App />;
}
