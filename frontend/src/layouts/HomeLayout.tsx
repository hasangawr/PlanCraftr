import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import Hero from '../components/Hero';
import { useEffect, useState } from 'react';
import axios from 'axios';

const HomeLayout = () => {
  const [isUnauthenticated, setIsUnauthenticated] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/auth/verify`,
          {
            withCredentials: true,
          },
        );

        if (response.data.message === 'Unauthorized') {
          setIsUnauthenticated(true);
        } else {
          setIsUnauthenticated(false);
        }
      } catch (error) {
        console.log(error);
        setIsUnauthenticated(true);
      }
    };

    checkAuthStatus();
  }, []);

  if (isUnauthenticated === null) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }

  return isUnauthenticated ? (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      <Hero />
      <Outlet />
    </Box>
  ) : (
    <Navigate to="/dashboard" />
  );
};

export default HomeLayout;
