import { Box, Button, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthProvider';

const Dashboard = () => {
  const { logout } = useAuth();
  const handleClick = () => {
    logout();
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
