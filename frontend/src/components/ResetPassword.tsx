import { Box, Button, Link, Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { passwordValidator } from '../utils/validators';
import { ArrowBack } from '@mui/icons-material';

const ResetPassword = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean | string>(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    boolean | string
  >(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      if (!password) setPasswordError('Password is required');
      if (!confirmPassword) setConfirmPasswordError('Enter password again');
      return;
    }

    if (!passwordError && !confirmPasswordError) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API}/auth/reset-password`,
          { password },
          { withCredentials: true },
        );

        console.log('Password reset response: ', response);
      } catch (error) {
        console.log('Password reset failed: ', error);
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
        <Box sx={{ marginTop: '2rem', display: 'flex', alignItems: 'center' }}>
          <Box>
            <ArrowBack fontSize="small" />
          </Box>
          <Box>
            <Typography>
              <Link
                href="/"
                sx={{ color: '#6366F1', cursor: 'pointer' }}
                underline="none"
              >
                Log in
              </Link>
            </Typography>
          </Box>
        </Box>
        <Box sx={{ marginTop: '2rem' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Reset password
          </Typography>
        </Box>
        <Box className="reset-password-form">
          <Box component="form" onSubmit={handleSubmit} noValidate>
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
            <TextField
              id="confirm-password"
              label="Password (Confirm)"
              variant="outlined"
              type="password"
              fullWidth
              sx={{ marginTop: '2rem' }}
              onChange={(e) => {
                setPasswordError(passwordValidator(e.target.value));
                setConfirmPassword(e.target.value);
              }}
              error={passwordError ? true : false}
              helperText={passwordError}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: '#6366F1', marginTop: '1.5rem' }}
              aria-label="Reset"
              type="submit"
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
