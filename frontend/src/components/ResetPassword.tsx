import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { passwordValidator } from '../utils/validators';
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';

const ResetPassword = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean | string>(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    boolean | string
  >(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordMismatchError, setPasswordMismatchError] =
    useState<boolean>(false);
  const [sendingRequest, setSendingRequest] = useState<boolean>(false);

  const navigate = useNavigate();
  const theme = useTheme();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      if (!password) setPasswordError('Password is required');
      if (!confirmPassword) setConfirmPasswordError('Enter password again');
      return;
    }

    if (!passwordError && !confirmPasswordError && !passwordMismatchError) {
      try {
        setSendingRequest(true);
        const response = await axios.put(
          `${import.meta.env.VITE_API}/auth/reset-password`,
          { password },
          { withCredentials: true },
        );

        if (response.status === 200 && response.data.message === 'success') {
          setSendingRequest(false);
          navigate(`/login?reset-user=${response.data.userID}`);
          localStorage.setItem(
            'authEvent',
            JSON.stringify({ type: 'reset', timestamp: Date.now() }),
          );
          return;
        }

        setSendingRequest(false);
        navigate(`/login?reset-user=failed`);
      } catch (error) {
        setSendingRequest(false);
        console.error('Password reset failed: ', error);
        navigate(`/login?reset-user=failed`);
      }
    }
  };

  return sendingRequest ? (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  ) : (
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
            {/* <TextField
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
            /> */}

            <FormControl fullWidth>
              {/* password */}
              <InputLabel
                htmlFor="outlined-adornment-password"
                variant="outlined"
                sx={{ marginTop: '1rem' }}
                error={passwordError ? true : false}
              >
                New password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? 'hide the password'
                          : 'display the password'
                      }
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                sx={{ marginTop: '1rem' }}
                fullWidth
                onChange={(e) => {
                  setPasswordError(passwordValidator(e.target.value));
                  setPassword(e.target.value);
                }}
                error={passwordError ? true : false}
              />
              {passwordError && (
                <FormHelperText error={true}>{passwordError}</FormHelperText>
              )}
            </FormControl>

            {/* confirm password */}
            <FormControl fullWidth>
              <InputLabel
                htmlFor="outlined-adornment-confirm-password"
                variant="outlined"
                sx={{ marginTop: '1rem' }}
                error={confirmPasswordError ? true : false}
              >
                Confirm new password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showConfirmPassword
                          ? 'hide the password'
                          : 'display the password'
                      }
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
                sx={{ marginTop: '1rem' }}
                fullWidth
                onChange={(e) => {
                  setConfirmPasswordError(passwordValidator(e.target.value));
                  setConfirmPassword(e.target.value);
                  if (e.target.value !== password) {
                    setPasswordMismatchError(true);
                  } else {
                    setPasswordMismatchError(false);
                  }
                }}
                error={confirmPasswordError ? true : false}
              />
              {confirmPasswordError && (
                <FormHelperText error={true}>
                  {confirmPasswordError}
                </FormHelperText>
              )}
              {passwordMismatchError && (
                <FormHelperText error={true}>
                  Passwords do not match
                </FormHelperText>
              )}
            </FormControl>

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
