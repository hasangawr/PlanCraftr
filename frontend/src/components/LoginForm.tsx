import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { emailValidator } from '../utils/validators';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';
import AlertSnackBar from './AlertSnackBar';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import { useAuth } from '../contexts/AuthProvider';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean | string>(false);
  const [passwordError, setPasswordError] = useState<boolean | string>(false);
  const [alertOpen, setAlertOpen] = useState<boolean | null>(false);
  const [emailAlertOpen, setEmailAlertOpen] = useState<boolean | null>(false);
  const [resetAlertOpen, setResetAlertOpen] = useState<boolean | null>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [sendingRequest, setSendingRequest] = useState<boolean>(false);

  const theme = useTheme();
  const navigate = useNavigate();
  const { checkAuthStatus, checkUserVerified, isVerified } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const user = urlSearchParams.get('user');
  const resetUser = urlSearchParams.get('reset-user');

  useEffect(() => {
    if (user) {
      checkUserVerified(user);
      setEmailAlertOpen(isVerified);
    }
  }, [checkUserVerified, isVerified, user]);

  useEffect(() => {
    if (resetUser) {
      setResetAlertOpen(true);
    }
  }, [resetUser]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      if (!email) setEmailError('Email is required');
      if (!password) setPasswordError('Password is required');
      return;
    }

    if (!emailError && !passwordError) {
      try {
        setSendingRequest(true);

        const response = await axios.post(
          `${import.meta.env.VITE_API}/auth/login`,
          { email, password },
          { withCredentials: true },
        );

        if (
          response.status === 200 &&
          response.data.message === 'Login Successful'
        ) {
          setSendingRequest(false);
          localStorage.setItem(
            'authEvent',
            JSON.stringify({ type: 'login', timestamp: Date.now() }),
          );
          setEmail('');
          setPassword('');
          checkAuthStatus();
          //navigate('/dashboard');
        } else {
          setSendingRequest(false);
          setAlertOpen(true);
        }
      } catch (error) {
        setSendingRequest(false);
        setAlertOpen(true);
        console.log('login failed: ', error);
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
      {
        <AlertSnackBar
          open={alertOpen}
          setOpen={setAlertOpen}
          displayDuration={5000}
          severity="error"
          message="Invalid credentials. Please check your username, password and try again."
          position={{ vertical: 'bottom', horizontal: 'left' }}
        />
      }
      {emailAlertOpen === null ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <AlertSnackBar
          displayDuration={5000}
          severity="success"
          open={emailAlertOpen}
          message="Email successfully verified. Please login to continue."
          setOpen={setEmailAlertOpen}
          position={{ vertical: 'top', horizontal: 'center' }}
        />
      )}
      {
        <AlertSnackBar
          open={resetAlertOpen}
          setOpen={setResetAlertOpen}
          displayDuration={5000}
          severity={
            resetUser === 'failed' || resetUser === 'expired'
              ? 'error'
              : 'success'
          }
          message={
            resetUser === 'failed'
              ? 'Password reset failed. Please try again.'
              : resetUser === 'expired'
                ? 'Password reset failed. Link expired.'
                : 'Password reset successful. Please login to continue.'
          }
          position={{ vertical: 'top', horizontal: 'center' }}
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
            {/* <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              sx={{ marginTop: '1rem' }}
              onChange={(e) => {
                //setPasswordError(passwordValidator(e.target.value));
                setPassword(e.target.value);
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
                Password
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
                  //setPasswordError(passwordValidator(e.target.value));
                  setPassword(e.target.value);
                }}
                error={passwordError ? true : false}
              />
              {passwordError && (
                <FormHelperText error={true}>{passwordError}</FormHelperText>
              )}
            </FormControl>

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
