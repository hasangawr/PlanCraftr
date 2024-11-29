import { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { emailValidator, passwordValidator } from '../utils/validators';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';

const LoginForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean | string>(false);
  const [passwordError, setPasswordError] = useState<boolean | string>(false);

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

        //console.log('login response: ', response);
        if (
          response.status === 200 &&
          response.data.message === 'Login Successful'
        ) {
          navigate('/dashboard');
        }
      } catch (error) {
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
      <Paper elevation={3} sx={{ padding: '2rem', margin: '0 4rem' }}>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ marginRight: '10px' }}>
            <svg
              id="logo-35"
              width="50"
              height="39"
              viewBox="0 0 50 39"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {' '}
              <path
                d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
                className="ccompli1"
                fill="#007AFF"
              ></path>{' '}
              <path
                d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
                className="ccustom"
                fill="#312ECB"
              ></path>{' '}
            </svg>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Plan<span style={{ color: '#6366F1' }}>Craftr</span>
          </Typography>
        </Box>
        <Box sx={{ marginTop: '2rem' }}>
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
        <Box className="login-form" marginTop="2rem">
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
              sx={{ marginTop: '2rem' }}
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
