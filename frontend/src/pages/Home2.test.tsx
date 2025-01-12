import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home2 from './Home2';

describe('Home Page', () => {
  it.skip('Should render PlanCraftr as site logo', () => {
    render(<Home2 />);

    const logo = screen.getByRole('heading', { name: 'PlanCraftr' });

    expect(logo).toBeInTheDocument();
  });

  it('Should render the Log in button', () => {
    render(<Home2 />);

    const loginButton = screen.getByRole('button', { name: 'Log in' });

    expect(loginButton).toBeInTheDocument();
  });

  it('Should render the Sign up button', () => {
    render(<Home2 />);

    const signUpButton = screen.getByRole('button', { name: 'Sign up' });

    expect(signUpButton).toBeInTheDocument();
  });
});
