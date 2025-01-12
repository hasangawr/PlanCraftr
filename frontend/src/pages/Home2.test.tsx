import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home2 from './Home2';
import TestComponentWrapper from '../../__test__/TestComponentWrapper';

describe('Home Page', () => {
  it.skip('Should render PlanCraftr as site logo', () => {
    render(
      <TestComponentWrapper>
        <Home2 />
      </TestComponentWrapper>,
    );

    const logo = screen.getByRole('heading', { name: 'PlanCraftr' });

    expect(logo).toBeInTheDocument();
  });

  it('Should render the Log in button', () => {
    render(
      <TestComponentWrapper>
        <Home2 />
      </TestComponentWrapper>,
    );

    const loginButton = screen.getByRole('link', { name: 'Log in' });

    expect(loginButton).toBeInTheDocument();
  });

  it('Should render the Sign up button', () => {
    render(
      <TestComponentWrapper>
        <Home2 />
      </TestComponentWrapper>,
    );

    const signUpButton = screen.getByRole('link', { name: 'Sign up' });

    expect(signUpButton).toBeInTheDocument();
  });
});
