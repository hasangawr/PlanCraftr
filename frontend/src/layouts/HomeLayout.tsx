import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Hero from '../components/Hero';

const HomeLayout = () => {
  return (
    <Box display={'flex'}>
      <Hero />
      <Outlet />
    </Box>
  );
};

export default HomeLayout;
