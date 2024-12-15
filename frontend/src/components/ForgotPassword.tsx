import {
  Box,
  Button,
  Link,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { emailValidator } from '../utils/validators';
import { EmailContext } from '../contexts/EmailProvider';

const ForgotPassword = () => {
  const emailContext = useContext(EmailContext);
  const theme = useTheme();

  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean | string>(false);

  const navigate = useNavigate();

  // display error frontend
  //useEffect(() => {}, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      if (!email) setEmailError('Email is required');
      return;
    }

    if (!emailError) {
      emailContext?.setForgotPasswordEmail(email);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API}/auth/forgot-password`,
          { email },
          { withCredentials: true },
        );

        console.log('Forgot password response: ', response);

        if (
          response.status === 200 &&
          response.data.message === 'Password reset link sent'
        ) {
          navigate('/reset-password-message');
        }
      } catch (error) {
        console.log('Password reset request failed: ', error);
      }
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        flex: '0 0 37.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: '2rem',
          margin: '0 4rem',
          maxWidth: '25rem',
          backgroundColor: theme.palette.graySecondary.main,
        }}
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => {
            navigate('/');
          }}
        >
          <Box sx={{ marginRight: '5px' }}>
            <NotesRoundedIcon sx={{ color: theme.palette.bluePrimary.main }} />
          </Box>
          <Box sx={{ marginBottom: '5px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Plan<span style={{ color: '#6366F1' }}>Craftr</span>
            </Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          sx={{ cursor: 'pointer', alignItems: 'center', marginTop: '1.5rem' }}
        >
          <ArrowBack
            sx={{ fontSize: '1rem', color: theme.palette.bluePrimary.main }}
          />
          <Link underline="none" href="/login">
            <Typography variant="body1">Log in</Typography>
          </Link>
        </Box>
        <Box sx={{ marginTop: '1rem' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Forgot password
          </Typography>
        </Box>
        <Box className="forgot-password-form">
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              type="email"
              fullWidth
              sx={{ marginTop: '1rem' }}
              onChange={(e) => {
                setEmailError(emailValidator(e.target.value));
                setEmail(e.target.value);
              }}
              error={emailError ? true : false}
              helperText={emailError}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: '#6366F1', marginTop: '1.5rem' }}
              aria-label="Register"
              type="submit"
            >
              Send Reset Link
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
