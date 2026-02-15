import { useState, useEffect } from 'react';
import { RoutePath } from '../types';

export const useCustomRouter = () => {
  const [path, setPath] = useState<RoutePath>('/');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // remove #
      if (hash === '' || hash === '/') {
        setPath('/');
      } else if (hash === '/menu') {
        setPath('/menu');
      } else if (hash === '/reservation') {
        setPath('/reservation');
      } else {
        setPath('/'); // Fallback
      }
    };

    // Initialize
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (newPath: RoutePath) => {
    window.location.hash = newPath;
  };

  return { path, navigate };
};