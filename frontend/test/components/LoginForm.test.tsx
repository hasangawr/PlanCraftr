import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import LoginForm from '../../src/components/LoginForm';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RegisterForm from '../../src/components/RegisterForm';
import App from '../../src/App';

describe('LoginForm', () => {
  describe('navigation', () => {
    test.todo(
      'Should navigate to register when register link is clicked',
      async () => {
        //let testHistory, testLocation;
        render(
          <MemoryRouter initialEntries={['/']}>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="register" element={<RegisterForm />} />
            </Routes>
          </MemoryRouter>,
        );

        const registerLink = screen.getByRole('link', { name: 'Register' });

        await userEvent.click(registerLink);

        const link = await screen.getByRole('link', {
          name: 'Terms and Conditions',
        });

        expect(link).toBeInTheDocument();
      },
    );

    test.todo(
      'When Forgot password link is clicked, it should navigate to forgot-password page',
    );
  });

  describe('field validations', () => {
    describe('Email validation', () => {
      test('When continue button is clicked, should display an error if email is empty', async () => {
        const user = userEvent.setup();

        render(<LoginForm />);

        const continueBtn = screen.getByRole('button', { name: 'login' });

        await user.click(continueBtn);

        await waitFor(() => {
          expect(screen.getByText('Email is required')).toBeInTheDocument();
        });
      });

      test('Should display an error if email is invalid - case 1', async () => {
        const user = userEvent.setup();

        render(<LoginForm />);

        const email = screen.getByRole('textbox', { name: 'Email' });

        await user.type(email, 'test');

        await waitFor(() => {
          expect(screen.getByText('Invalid email address')).toBeInTheDocument();
        });
      });
    });

    describe('Password validation', () => {
      test('When continue button is clicked, should display the error if password is empty', async () => {
        const user = userEvent.setup();

        render(<LoginForm />);

        const continueBtn = screen.getByRole('button', { name: 'login' });

        await user.click(continueBtn);

        await waitFor(() => {
          expect(screen.getByText('Password is required')).toBeInTheDocument();
        });
      });

      test.todo(
        'Should display the error, if password is less than 6 characters',
        () => {},
      );

      test.todo(
        'Should diplay the error, if password does not contain at least one number',
        () => {},
      );
    });

    test.todo(
      'When continue button is clicked, Should not redirect to dashboard if email and password are invalid',
      () => {},
    );

    test.todo(
      'When continue button is clicked, Should redirect to dashboard if email and password are valid',
      () => {},
    );
  });
});
