import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType } from '../types/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/auth/verify`,
        {
          withCredentials: true,
        },
      );

      if (
        response.status === 200 &&
        response.data.message === 'Authenticated'
      ) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking user auth status: ', error);
      setIsLoggedIn(false);
    }
  };

  const logout = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API}/auth/logout`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        localStorage.setItem(
          'authEvent',
          JSON.stringify({ type: 'logout', timestamp: Date.now() }),
        );
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error during logout: ', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const checkUserVerified = async (user: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/auth/user-email-verified?user=${user}`,
        { withCredentials: true },
      );

      if (response.status === 200 && response.data.message === 'Verified') {
        localStorage.setItem(
          'authEvent',
          JSON.stringify({ type: 'verified', user, timestamp: Date.now() }),
        );
        setIsVerified(true);
        return;
      } else if (response.data.message === 'Unverified') {
        setIsVerified(false);
        return;
      }

      setIsVerified(false);
    } catch (error) {
      console.error('Error checking user verified: ', error);
      setIsVerified(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  });

  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === 'authEvent') {
        const authEvent = JSON.parse(event.newValue || '{}');

        if (authEvent.type === 'logout') {
          setIsLoggedIn(false);
        }
        if (authEvent.type === 'login') {
          setIsLoggedIn(true);
        }
        if (authEvent.type === 'verified') {
          setIsVerified(true);
        }
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        checkAuthStatus,
        logout,
        checkUserVerified,
        isVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthProvider;
