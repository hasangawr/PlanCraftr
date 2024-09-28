import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import RegisterForm from '../../src/components/RegisterForm';

describe('Register Form', () => {
  test('Should render name, email and password fields', () => {
    render(<RegisterForm />);

    const name = screen.getByRole('textbox', { name: 'Name' });
    const email = screen.getByRole('textbox', { name: 'Email' });
    const password = screen.getByLabelText('Password');

    expect(name).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
  });

  test('Should render Register button', () => {
    render(<RegisterForm />);

    const button = screen.getByRole('button', { name: 'Register' });

    expect(button).toBeInTheDocument();
  });

  test('Should render a link to login', () => {
    render(<RegisterForm />);

    const loginLink = screen.getByRole('link', { name: 'Log in' });

    expect(loginLink).toBeInTheDocument();
  });

  test('Should render a link to Terms and Conditions', () => {
    render(<RegisterForm />);

    const termsLink = screen.getByRole('link', {
      name: 'Terms and Conditions',
    });

    expect(termsLink).toBeInTheDocument();
  });
});
