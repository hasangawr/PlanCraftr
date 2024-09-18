import { Box, Typography } from '@mui/material';

const Hero = () => {
  return (
    <Box
      sx={{
        background:
          'linear-gradient(109.6deg, rgb(20, 30, 48) 11.2%, rgb(36, 59, 85) 91.1%);',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box sx={{ flex: '0 1 49rem' }}>
        <Box>
          <Typography
            variant="h2"
            sx={{ fontWeight: 'bold', color: '#ffffff' }}
          >
            Welcome to PlanCraftr
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ color: '#6C737F' }}>
            Welcome to your personal productivity hub! Plan your goals, break
            them into tasks, and track your progress—all in one place. Let’s
            achieve more, step by step!
          </Typography>
        </Box>
        <Box>
          <Box sx={{ marginTop: '1.5rem' }}>
            <Typography sx={{ color: '#6C737F' }}>
              "Success is the sum of small efforts, repeated day in and day
              out."
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ color: '#6C737F', fontStyle: 'italic' }}>
              – Robert Collier
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
