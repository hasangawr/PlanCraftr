import { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Link,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { emailValidator, passwordValidator } from '../utils/validators';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';
import AlertSnackBar from './AlertSnackBar';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';

const LoginForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean | string>(false);
  const [passwordError, setPasswordError] = useState<boolean | string>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const theme = useTheme();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      if (!email) setEmailError('Email is required');
      if (!password) setPasswordError('Password is required');
      return;
    }

    if (!emailError && !passwordError) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API}/auth/login`,
          { email, password },
          { withCredentials: true },
        );

        if (
          response.status === 200 &&
          response.data.message === 'Login Successful'
        ) {
          setEmail('');
          setPassword('');
          navigate('/dashboard');
        } else {
          setAlertOpen(true);
        }
      } catch (error) {
        setAlertOpen(true);
        console.log('login failed: ', error);
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
      {
        <AlertSnackBar
          open={alertOpen}
          setOpen={setAlertOpen}
          displayDuration={5000}
          severity="error"
          message="Invalid credentials. Please check your username and password and try again."
        />
      }
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
        <Box sx={{ marginTop: '1rem' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Log in
          </Typography>
          <Typography sx={{ color: '#6C737F' }}>
            Don't have an account?{' '}
            <Link
              href="register"
              sx={{ color: '#6366F1', cursor: 'pointer' }}
              underline="none"
            >
              Register
            </Link>
          </Typography>
        </Box>
        <Box className="login-form" marginTop="1.5rem">
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              type="email"
              fullWidth
              onChange={(e) => {
                setEmailError(emailValidator(e.target.value));
                setEmail(e.target.value);
              }}
              error={emailError ? true : false}
              helperText={emailError}
            />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              sx={{ marginTop: '1rem' }}
              onChange={(e) => {
                setPasswordError(passwordValidator(e.target.value));
                setPassword(e.target.value);
              }}
              error={passwordError ? true : false}
              helperText={passwordError}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: '#6366F1', marginTop: '1.5rem' }}
              aria-label="login"
              type="submit"
            >
              Continue
            </Button>
          </Box>
          <Divider>
            <Typography>or</Typography>
          </Divider>
          <GoogleLoginButton />
          <Typography sx={{ marginTop: '1.75rem' }}>
            <Link
              style={{ color: '#6366F1', cursor: 'pointer' }}
              underline="none"
              href="forgot-password"
            >
              Forgot password?
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginForm;
