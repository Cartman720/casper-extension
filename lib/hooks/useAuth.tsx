import { useEffect, useState } from 'react';
import { getStorageValue } from '../storage';

/**
 * NOTE: Intended to be used in content script only
 * @returns
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuthState = () => {
    setIsLoading(true);

    getStorageValue('session:auth_token')
      .then((value) => {
        setIsAuthenticated(!!value);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    refreshAuthState();
  }, []);

  return { isAuthenticated, isLoading, refreshAuthState };
}
