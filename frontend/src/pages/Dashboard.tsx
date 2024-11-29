import { Box, Button, Typography } from '@mui/material';
import axios from 'axios';

const Dashboard = () => {
  const handleClick = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API}/auth/logout`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  return (
    <Box>
      <Typography variant="h1">Dashboard</Typography>
      <Button variant="outlined" onClick={handleClick}>
        LogOut
      </Button>
    </Box>
  );
};

export default Dashboard;
