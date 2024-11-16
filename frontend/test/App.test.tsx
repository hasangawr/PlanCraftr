import { describe, expect, test } from 'vitest';
import App from '../src/App';
import { render, screen } from '@testing-library/react';

describe('App', () => {
  test('Should render email, password and Login button', () => {
    render(<App />);

    const email = screen.getByRole('textbox', { name: 'Email' });
    const password = screen.getByLabelText('Password');
    const button = screen.getByRole('button', { name: 'login' });

    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });
});
