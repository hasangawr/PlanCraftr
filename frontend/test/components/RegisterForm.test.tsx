import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import RegisterForm from '../../src/components/RegisterForm';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import mainTheme from '../../src/themes/MainTheme';
import AuthProvider from '../../src/contexts/AuthProvider';

describe('Register Form', () => {
  test('Should render name, email and password fields', () => {
    render(
      <ThemeProvider theme={mainTheme}>
        <AuthProvider>
          <BrowserRouter>
            <RegisterForm />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>,
    );

    const name = screen.getByRole('textbox', { name: 'Name' });
    const email = screen.getByRole('textbox', { name: 'Email' });
    const password = screen.getByLabelText('Password');

    expect(name).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
  });

  test('Should render Register button', () => {
    render(
      <ThemeProvider theme={mainTheme}>
        <AuthProvider>
          <BrowserRouter>
            <RegisterForm />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>,
    );

    const button = screen.getByRole('button', { name: 'Register' });

    expect(button).toBeInTheDocument();
  });

  test('Should render a link to login', () => {
    render(
      <ThemeProvider theme={mainTheme}>
        <AuthProvider>
          <BrowserRouter>
            <RegisterForm />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>,
    );

    const loginLink = screen.getByRole('link', { name: 'Log in' });

    expect(loginLink).toBeInTheDocument();
  });

  test('Should render a link to Terms and Conditions', () => {
    render(
      <ThemeProvider theme={mainTheme}>
        <AuthProvider>
          <BrowserRouter>
            <RegisterForm />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>,
    );

    const termsLink = screen.getByRole('link', {
      name: 'Terms and Conditions',
    });

    expect(termsLink).toBeInTheDocument();
  });
});
