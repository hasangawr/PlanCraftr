import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import LoginForm from '../../src/components/LoginForm';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RegisterForm from '../../src/components/RegisterForm';

describe('LoginForm', () => {
  test.todo(
    'Should navigate to register when register link is clicked',
    async () => {
      //let testHistory, testLocation;
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
          </Routes>
        </MemoryRouter>,
      );

      const registerLink = screen.getByRole('link', { name: 'Register' });

      await userEvent.click(registerLink);

      // const link = await screen.getByRole('link', {
      //   name: 'Terms and Conditions',
      // });

      //expect(link).toBeInTheDocument();
    },
  );

  test('When continue button is clicked, should display an error if email is empty', async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    //const email = screen.getByRole('textbox', { name: 'Email' });
    const continueBtn = screen.getByRole('button', { name: 'login' });

    //await user.type(email, '');
    await user.click(continueBtn);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  test.todo('Email validation', () => {});

  test.todo(
    'When continue button is clicked, should display an error if password is empty',
    () => {},
  );

  test.todo(
    'Should redirect to dashboard if email and password are valid',
    () => {},
  );

  test.todo(
    'Should display the error message if email or password invalid',
    () => {},
  );

  test.todo(
    'When Forgot password link is clicked, it should navigate to forgot-password page',
  );
});
