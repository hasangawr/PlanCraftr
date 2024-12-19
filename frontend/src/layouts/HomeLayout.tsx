import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

const HomeLayout = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn === null) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return !isLoggedIn ? (
    <Box>
      <Outlet />
    </Box>
  ) : (
    <Navigate to="/dashboard" />
  );
};

export default HomeLayout;
