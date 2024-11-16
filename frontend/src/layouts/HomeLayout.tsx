import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Hero from '../components/Hero';

const HomeLayout = () => {
  return (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      <Hero />
      <Outlet />
    </Box>
  );
};

export default HomeLayout;
