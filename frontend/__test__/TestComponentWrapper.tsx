import { ThemeProvider } from '@mui/material';
import AuthProvider from '../src/contexts/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import mainTheme from '../src/themes/MainTheme';
import React, { ReactNode } from 'react';

interface IWrapperProps {
  children: ReactNode;
}

const TestComponentWrapper: React.FC<IWrapperProps> = (props) => {
  return (
    <ThemeProvider theme={mainTheme}>
      <AuthProvider>
        <BrowserRouter>{props.children}</BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default TestComponentWrapper;
