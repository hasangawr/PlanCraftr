import {
  Box,
  Button,
  Link,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { passwordValidator } from '../utils/validators';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';

const ResetPassword = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean | string>(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    boolean | string
  >(false);

  const navigate = useNavigate();
  const theme = useTheme();

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
              sx={{ marginTop: '1rem' }}
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
              sx={{ marginTop: '1rem' }}
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
