import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { EmailContext } from '../contexts/EmailProvider';
import { Box, CircularProgress } from '@mui/material';

const ProtectResetPasswordRoutes = () => {
  const [forgotPasswordInitiated, setForgotPasswordInitiated] = useState<
    boolean | null
  >(null);

  const emailContext = useContext(EmailContext);
  const email = emailContext?.forgotPasswordEmail;

  useEffect(() => {
    const checkForgotPasswordInitiated = async () => {
      if (email) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API}/auth/forgot-password-initiated?mail=${email}`,
            {
              withCredentials: true,
            },
          );

          console.log(response);

          if (
            response.status === 200 &&
            response.data.message === 'Initiated'
          ) {
            setForgotPasswordInitiated(true);
          } else {
            setForgotPasswordInitiated(false);
          }
        } catch (error) {
          console.log(error);
          setForgotPasswordInitiated(false);
        }
      }
    };

    checkForgotPasswordInitiated();
  }, [email]);

  if (forgotPasswordInitiated === null) {
    return (
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
    );
  }

  return forgotPasswordInitiated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectResetPasswordRoutes;
