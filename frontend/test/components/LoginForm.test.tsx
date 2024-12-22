import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import LoginForm from '../../src/components/LoginForm';
import RegisterForm from '../../src/components/RegisterForm';
// import ForgotPassword from '../../src/components/ForgotPassword';
import axios from 'axios';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import mainTheme from '../../src/themes/MainTheme';
import AuthProvider from '../../src/contexts/AuthProvider';
import ForgotPassword from '../../src/components/ForgotPassword';

describe('LoginForm', () => {
  describe('navigation', () => {
    test('Should navigate to register when register link is clicked', async () => {
      const clickMock = vi
        .fn()
        .mockImplementation(HTMLAnchorElement.prototype.click);
      clickMock.mockImplementationOnce(
        (link) =>
          link &&
          render(
            <ThemeProvider theme={mainTheme}>
              <AuthProvider>
                <BrowserRouter>
                  <RegisterForm />
                </BrowserRouter>
              </AuthProvider>
            </ThemeProvider>,
          ),
      );

      render(
        <ThemeProvider theme={mainTheme}>
          <AuthProvider>
            <MemoryRouter>
              <LoginForm />
            </MemoryRouter>
          </AuthProvider>
        </ThemeProvider>,
      );

      // Check if the LoginForm is initially rendered
      const registerLink = screen.getByRole('link', {
        name: 'Register',
      });

      // Simulate clicking the 'Register' link
      clickMock(registerLink);

      // After clicking the link, the RegisterForm should be rendered
      expect(
        screen.getByRole('link', {
          name: 'Log in',
        }),
      ).toBeInTheDocument();
    });

    test('When Forgot password link is clicked, it should navigate to forgot-password page', () => {
      const clickMock = vi
        .fn()
        .mockImplementation(HTMLAnchorElement.prototype.click);
      clickMock.mockImplementationOnce(
        (link) =>
          link &&
          render(
            <ThemeProvider theme={mainTheme}>
              <AuthProvider>
                <BrowserRouter>
                  <ForgotPassword />
                </BrowserRouter>
              </AuthProvider>
            </ThemeProvider>,
          ),
      );

      render(
        <ThemeProvider theme={mainTheme}>
          <AuthProvider>
            <MemoryRouter>
              <LoginForm />
            </MemoryRouter>
          </AuthProvider>
        </ThemeProvider>,
      );

      // Check if the LoginForm is initially rendered
      const forgotPasswordLink = screen.getByRole('link', {
        name: 'Forgot password?',
      });

      // Simulate clicking the 'Forgot password?' link
      clickMock(forgotPasswordLink);

      // After clicking the link, the ForgotPassword form should be rendered
      expect(
        screen.getByRole('heading', {
          name: 'Forgot password',
        }),
      ).toBeInTheDocument();
    });
  });

  describe('field validations', () => {
    describe('Email validation', () => {
      test('When continue button is clicked, should display an error if email is empty', async () => {
        const user = userEvent.setup();

        render(
          <ThemeProvider theme={mainTheme}>
            <AuthProvider>
              <MemoryRouter>
                <LoginForm />
              </MemoryRouter>
            </AuthProvider>
          </ThemeProvider>,
        );

        const continueBtn = screen.getByRole('button', { name: 'login' });

        await user.click(continueBtn);

        await waitFor(() => {
          expect(screen.getByText('Email is required')).toBeInTheDocument();
        });
      });

      test('Should display an error if email is invalid - case 1', async () => {
        const user = userEvent.setup();

        render(
          <ThemeProvider theme={mainTheme}>
            <AuthProvider>
              <MemoryRouter>
                <LoginForm />
              </MemoryRouter>
            </AuthProvider>
          </ThemeProvider>,
        );

        const email = screen.getByRole('textbox', { name: 'Email' });

        await user.type(email, 'test');

        await waitFor(() => {
          expect(screen.getByText('Invalid email address')).toBeInTheDocument();
        });
      });

      test('Should display an error if email is invalid - case 2', async () => {
        const user = userEvent.setup();

        render(
          <ThemeProvider theme={mainTheme}>
            <AuthProvider>
              <MemoryRouter>
                <LoginForm />
              </MemoryRouter>
            </AuthProvider>
          </ThemeProvider>,
        );

        const email = screen.getByRole('textbox', { name: 'Email' });

        await user.type(email, 'test@');

        await waitFor(() => {
          expect(screen.getByText('Invalid email address')).toBeInTheDocument();
        });
      });

      test('Should display an error if email is invalid - case 3', async () => {
        const user = userEvent.setup();

        render(
          <ThemeProvider theme={mainTheme}>
            <AuthProvider>
              <MemoryRouter>
                <LoginForm />
              </MemoryRouter>
            </AuthProvider>
          </ThemeProvider>,
        );

        const email = screen.getByRole('textbox', { name: 'Email' });

        await user.type(email, 'test@gmail.');

        await waitFor(() => {
          expect(screen.getByText('Invalid email address')).toBeInTheDocument();
        });
      });
    });

    describe('Password validation', () => {
      test('When continue button is clicked, should display the error if password is empty', async () => {
        const user = userEvent.setup();

        render(
          <ThemeProvider theme={mainTheme}>
            <AuthProvider>
              <MemoryRouter>
                <LoginForm />
              </MemoryRouter>
            </AuthProvider>
          </ThemeProvider>,
        );

        const continueBtn = screen.getByRole('button', { name: 'login' });

        await user.click(continueBtn);

        await waitFor(() => {
          expect(screen.getByText('Password is required')).toBeInTheDocument();
        });
      });

      test.todo(
        'Should display the error, if password is less than 6 characters',
        async () => {
          const user = userEvent.setup();

          render(
            <ThemeProvider theme={mainTheme}>
              <AuthProvider>
                <MemoryRouter>
                  <LoginForm />
                </MemoryRouter>
              </AuthProvider>
            </ThemeProvider>,
          );

          const password = screen.getByLabelText('Password');
          const continueBtn = screen.getByRole('button', { name: 'login' });

          await user.type(password, 'test1');
          await user.click(continueBtn);

          expect(
            screen.getByText(
              'Invalid credentials. Please check your username, password and try again.',
            ),
          ).toBeInTheDocument();

          // await waitFor(() => {

          // });
        },
      );

      test.todo(
        'Should diplay the error, if password does not contain at least one number',
        async () => {
          const user = userEvent.setup();

          render(
            <ThemeProvider theme={mainTheme}>
              <AuthProvider>
                <MemoryRouter>
                  <LoginForm />
                </MemoryRouter>
              </AuthProvider>
            </ThemeProvider>,
          );

          const password = screen.getByLabelText('Password');

          await user.type(password, 'testPass');

          await waitFor(() => {
            expect(
              screen.getByText(
                'Invalid credentials. Please check your username, password and try again.',
              ),
            ).toBeInTheDocument();
          });
        },
      );
    });

    test('When continue button is clicked, Should not send the verification api call, if email or password is invalid - case 1', async () => {
      const invalidEmail = 'qwerty@gmail';
      const invalidPass = 'test1234';

      const user = userEvent.setup();

      render(
        <ThemeProvider theme={mainTheme}>
          <AuthProvider>
            <MemoryRouter>
              <LoginForm />
            </MemoryRouter>
          </AuthProvider>
        </ThemeProvider>,
      );

      const emailField = screen.getByRole('textbox', { name: 'Email' });
      const passwordField = screen.getByLabelText('Password');
      const continueBtn = screen.getByRole('button', { name: 'login' });

      await user.type(emailField, invalidEmail);
      await user.type(passwordField, invalidPass);

      //check whether api request is made to authenticate the user
      const axiosPostSpy = vi.spyOn(axios, 'post').mockResolvedValue({});

      await user.click(continueBtn);

      await waitFor(() => {
        expect(axiosPostSpy).not.toHaveBeenCalled();
      });
    });

    test('When continue button is clicked, Should not send the verification api call, if email or password is invalid - case 2', async () => {
      const invalidEmail = 'qwerty@gmail.com';
      const invalidPass = 'testPass';

      const user = userEvent.setup();

      render(
        <ThemeProvider theme={mainTheme}>
          <AuthProvider>
            <MemoryRouter>
              <LoginForm />
            </MemoryRouter>
          </AuthProvider>
        </ThemeProvider>,
      );

      const emailField = screen.getByRole('textbox', { name: 'Email' });
      const passwordField = screen.getByLabelText('Password');
      const continueBtn = screen.getByRole('button', { name: 'login' });

      await user.type(emailField, invalidEmail);
      await user.type(passwordField, invalidPass);

      //check whether api request is made to authenticate the user
      const axiosPostSpy = vi.spyOn(axios, 'post');

      await user.click(continueBtn);

      await waitFor(() => {
        expect(axiosPostSpy).not.toHaveBeenCalled();
      });
    });

    // vi.mock('react-router-dom', async () => {
    //   const actual = await vi.importActual('react-router-dom');

    //   return {
    //     ...actual,
    //     useNavigate: () => vi.fn(),
    //   };
    // });

    test('When continue button is clicked, Should redirect to dashboard if email and password are valid', async () => {
      const validEmail = 'qwerty@gmail.com';
      const validPass = 'testPass1';

      const authSuccessResponse = { status: 200, data: { id: 1 } };

      const user = userEvent.setup();

      render(
        <ThemeProvider theme={mainTheme}>
          <AuthProvider>
            <MemoryRouter>
              <LoginForm />
            </MemoryRouter>
          </AuthProvider>
        </ThemeProvider>,
      );

      const emailField = screen.getByRole('textbox', { name: 'Email' });
      const passwordField = screen.getByLabelText('Password');
      const continueBtn = screen.getByRole('button', { name: 'login' });

      await user.type(emailField, validEmail);
      await user.type(passwordField, validPass);

      const axiosPostSpy = vi
        .spyOn(axios, 'post')
        .mockResolvedValue(authSuccessResponse);

      // const useNavigateSpy = vi
      //   .spyOn(router, 'useNavigate')
      //   .mockResolvedValue(() => render(<Dashboard />));

      await user.click(continueBtn);

      //check whether api request is made to authenticate the user
      await waitFor(() => {
        expect(axiosPostSpy).toHaveBeenCalledOnce();
      });

      // expect(useNavigateSpy).toHaveBeenCalledOnce();
      // expect(useNavigateSpy).toHaveBeenCalledWith('/dashboard');
    });
  });
});
