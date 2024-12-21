import {
  Box,
  Button,
  Checkbox,
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
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  emailValidator,
  nameValidator,
  passwordValidator,
} from '../utils/validators';
import AlertSnackBar from './AlertSnackBar';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleLoginButton from './GoogleLoginButton';
import { useAuth } from '../contexts/AuthProvider';

const RegisterForm = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [termsChecked, setTermsChecked] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean | string>(false);
  const [emailError, setEmailError] = useState<boolean | string>(false);
  const [passwordError, setPasswordError] = useState<boolean | string>(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    boolean | string
  >(false);
  const [termsError, setTermsError] = useState<boolean | string>(false);
  const [alertOpen, setAlertOpen] = useState<boolean | null>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [passwordMismatchError, setPasswordMismatchError] =
    useState<boolean>(false);
  const [sendingRequest, setSendingRequest] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const user = urlSearchParams.get('user');

  const navigate = useNavigate();

  const theme = useTheme();
  const { changeUserVerifiedState } = useAuth();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  useEffect(() => {
    if (user === 'link-expired') {
      setAlertMessage('Verification link expired. Please register again.');
      setAlertOpen(true);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (document.activeElement?.ariaLabel === 'Register') {
      if (!name || !email || !password || !termsChecked) {
        if (!name) setNameError('Name is required');
        if (!email) setEmailError('Email is required');
        if (!password) setPasswordError('Password is required');
        if (!termsChecked)
          setTermsError('You need to accept Terms & Conditions');
        return;
      }

      if (
        !nameError &&
        !emailError &&
        !passwordError &&
        termsChecked &&
        !passwordMismatchError
      ) {
        try {
          setSendingRequest(true);

          const response = await axios.post(
            `${import.meta.env.VITE_API}/auth/register`,
            { name, email, password },
            { withCredentials: true },
          );

          if (response.status === 201 && response.data.email) {
            changeUserVerifiedState(false);
            setSendingRequest(false);
            setName('');
            setEmail('');
            setPassword('');
            navigate('/verify-email');
          } else {
            setSendingRequest(false);
            setAlertMessage(response.data.message);
            setAlertOpen(true);
          }
        } catch (error) {
          setSendingRequest(false);
          console.log('Registration failed: ', error);
          setAlertMessage('Registration failed. Try again');
          setAlertOpen(true);
        }
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
      <AlertSnackBar
        open={alertOpen}
        setOpen={setAlertOpen}
        displayDuration={5000}
        severity="error"
        message={alertMessage}
        position={{
          vertical: user === 'link-expired' ? 'top' : 'bottom',
          horizontal: user === 'link-expired' ? 'center' : 'left',
        }}
      />
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
            Register
          </Typography>
          <Typography sx={{ color: '#6C737F' }}>
            Already have an account?{' '}
            <Link
              href="/login"
              sx={{ color: '#6366F1', cursor: 'pointer' }}
              underline="none"
            >
              Log in
            </Link>
          </Typography>
        </Box>
        <Box className="register-form" marginTop="1.5rem">
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              type="text"
              fullWidth
              onChange={(e) => {
                setNameError(nameValidator(e.target.value));
                setName(e.target.value);
              }}
              error={nameError ? true : false}
              helperText={nameError}
            />
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
                Confirm Password
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

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={termsChecked}
                onChange={(e) => {
                  setTermsChecked(e.target.checked);
                  setTermsError(e.target.checked ? false : true);
                }}
              />
              <Typography>
                I have read the{' '}
                <Link href="/terms" underline="none">
                  Terms and Conditions
                </Link>
              </Typography>
            </Box>
            {!termsChecked && (
              <Box sx={{ marginLeft: '1rem' }}>
                <Typography variant="caption" sx={{ color: '#d32f2f' }}>
                  {termsError}
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: '#6366F1', marginTop: '1rem' }}
              aria-label="Register"
              type="submit"
            >
              Register
            </Button>

            <Divider>
              <Typography>or</Typography>
            </Divider>
            <GoogleLoginButton />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterForm;
