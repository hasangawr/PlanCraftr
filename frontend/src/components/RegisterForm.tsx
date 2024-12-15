import {
  Box,
  Button,
  Checkbox,
  Link,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  emailValidator,
  nameValidator,
  passwordValidator,
} from '../utils/validators';
import AlertSnackBar from './AlertSnackBar';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';

const RegisterForm = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [termsChecked, setTermsChecked] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean | string>(false);
  const [emailError, setEmailError] = useState<boolean | string>(false);
  const [passwordError, setPasswordError] = useState<boolean | string>(false);
  const [termsError, setTermsError] = useState<boolean | string>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  const navigate = useNavigate();

  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password || !termsChecked) {
      if (!name) setNameError('Name is required');
      if (!email) setEmailError('Email is required');
      if (!password) setPasswordError('Password is required');
      if (!termsChecked) setTermsError('You need to accept Terms & Conditions');
      return;
    }

    if (!nameError && !emailError && !passwordError && termsChecked) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API}/auth/register`,
          { name, email, password },
          { withCredentials: true },
        );

        console.log('Registration response: ', response);

        if (response.status === 201 && response.data.email) {
          setName('');
          setEmail('');
          setPassword('');
          navigate('/verify-email');
        } else {
          setAlertMessage(response.data.message);
          setAlertOpen(true);
        }
      } catch (error) {
        console.log('Registration failed: ', error);
        setAlertMessage('Registration failed. Try again');
        setAlertOpen(true);
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
      <AlertSnackBar
        open={alertOpen}
        setOpen={setAlertOpen}
        displayDuration={5000}
        severity="error"
        message={alertMessage}
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

            {/*TODO: Add this without validation errors*/}
            {/* <Divider>
              <Typography>or</Typography>
            </Divider>
            <GoogleLoginButton /> */}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterForm;
