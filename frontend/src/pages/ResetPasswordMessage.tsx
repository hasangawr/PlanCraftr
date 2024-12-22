import {
  Box,
  Container,
  Divider,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { useAuth } from '../contexts/AuthProvider';
import { Navigate } from 'react-router-dom';

const ResetPasswordMessage = () => {
  const theme = useTheme();
  const { isPasswordReset } = useAuth();

  // here null means forgotPassword flow is not yet initiated - so the user cannot see the password reset message
  // false means forgotPassword flow has now initiated - so the user can see the password reset message
  // true means forgotPassword flow has now completed - so the user cannot see the password reset message

  if (isPasswordReset === null) {
    return <Navigate to="/" />;
  } else if (isPasswordReset) {
    return <Navigate to="/login" />;
  }
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
        }}
      >
        <Box sx={{ width: '10rem' }}>
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
            A password reset link has been sent to your email address. Please
            check your inbox and click the link to reset your password.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPasswordMessage;
