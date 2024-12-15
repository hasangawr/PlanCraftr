import { Box, Button, Typography, useTheme } from '@mui/material';

const Hero = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: '25%',
        //marginLeft: '-6rem',
      }}
    >
      <Box>
        <Typography
          variant="h1"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.background.default,
            letterSpacing: '0.25em',
          }}
        >
          Plan. Track. Succeed.
        </Typography>
      </Box>
      <Box sx={{ marginTop: '0.75rem' }}>
        <Typography
          variant="h2"
          sx={{
            color: theme.palette.grayPrimary.main,
          }}
        >
          Your all-in-one platform for setting goals, tracking habits, and
          unlocking your full potential
        </Typography>
      </Box>
      <Box sx={{ marginTop: '1.5rem' }}>
        <Button
          variant="outlined"
          href="/register"
          sx={{ padding: '0.5rem 1.5rem' }}
        >
          start for free
        </Button>
      </Box>
    </Box>
  );
};

export default Hero;
