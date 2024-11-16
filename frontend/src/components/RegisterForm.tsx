import {
  Box,
  Button,
  Checkbox,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

const RegisterForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  //const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      //setError('Please enter both email and password.');
      return;
    }

    const credentials = { email, password };

    setEmail('');
    setPassword('');

    //setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/auth/login`,
        credentials,
      );

      console.log('login response: ', response);
    } catch (error) {
      console.log('login failed: ', error);
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
            Register
          </Typography>
          <Typography sx={{ color: '#6C737F' }}>
            Already have an account?{' '}
            <Link
              href="/"
              sx={{ color: '#6366F1', cursor: 'pointer' }}
              underline="none"
            >
              Log in
            </Link>
          </Typography>
        </Box>
        <Box className="login-form" marginTop="2rem">
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              type="text"
              fullWidth
            />
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              type="email"
              fullWidth
              sx={{ marginTop: '2rem' }}
            />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              sx={{ marginTop: '2rem' }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox />
              <Typography>
                I have read the{' '}
                <Link href="/terms" underline="none">
                  Terms and Conditions
                </Link>
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: '#6366F1', marginTop: '1.5rem' }}
              aria-label="Register"
            >
              Register
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterForm;
