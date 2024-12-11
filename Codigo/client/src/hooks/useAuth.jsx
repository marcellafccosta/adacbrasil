import { useEffect, useState } from 'react';
import AuthService from '../services/AuthService';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isLoggedIn());

  useEffect(() => {
    const interval = setInterval(() => {
      if (AuthService.isSessionExpired()) {
        AuthService.logout();
        setIsAuthenticated(false);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return { isAuthenticated };
};

export default useAuth;
