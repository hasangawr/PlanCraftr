import {
  Box,
  Container,
  Divider,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';

const VerifyEmail = () => {
  const theme = useTheme();
  return (
    <Container maxWidth="lg" sx={{ paddingTop: '10rem' }}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: '50rem',
          margin: 'auto',
          display: 'flex',
          padding: '1.5rem',
          backgroundColor: theme.palette.graySecondary.main,
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '5rem' }}>
          <img src="/success.svg" />
        </Box>
        <Divider
          orientation="vertical"
          sx={{ margin: '0 1rem' }}
          variant="fullWidth"
          flexItem
        />
        <Box>
          <Typography variant="h2">
            Click the link in your mail to verify the email.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default VerifyEmail;
