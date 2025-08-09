import { useEffect, useState } from 'react';
import { getStorageValue } from '../storage';

/**
 * NOTE: Intended to be used in content script only
 * @returns
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Call this from an actual user click (very important!)
  const requestLogin = async () => {
    try {
      await browser.runtime.sendMessage({
        type: 'OPEN_LOGIN_POPUP',
      });
      // optional: handle res.alt to know if we used a fallback
    } catch (e) {
      // last resort: open options/login page
      await browser.runtime.openOptionsPage();
    }
  };

  const refreshAuthState = () => {
    setIsLoading(true);

    getStorageValue('session:auth_token')
      .then((value) => {
        console.log('value', value);
        setIsAuthenticated(!!value);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // If the user is authenticated, don't refresh the auth state
    if (isAuthenticated) {
      return;
    }

    const interval = setInterval(() => {
      refreshAuthState();
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  return { isAuthenticated, isLoading, requestLogin, refreshAuthState };
}
