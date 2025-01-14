import {
  checkUserEmailVerified,
  createNewKeyForUser,
  forgotPasswordReset,
  registerUser,
  sendPasswordResetLink,
  verifyResetPasswordKey,
  verifyUser,
} from '../use-cases';
import makeForgotPasswordHandler from './auth/forgotPasswordHandler';
import makeForgotPasswordResetHandler from './auth/forgotPasswordResetHandler';
import makeLogoutHandler from './auth/logoutHandler';
import makeRegistrationHandler from './auth/registrationHandler';
import makeUserAuthStatusVerifyHandler from './auth/userAuthStatusVerifyHandler';
import makeUserEmailVerifyStatusHandler from './auth/userEmailVerifyStatusHandler';
import makeUserVerificationHandler from './auth/userVerificationHandler';
import makeVerifyResetPasswordKeyHandler from './auth/verifyResetPasswordKeyHandler';
import makeErrorHandler from './error/errorHandler';

const errorHandler = makeErrorHandler();

const registrationHandler = makeRegistrationHandler(registerUser);
const userVerificationHandler = makeUserVerificationHandler(verifyUser);
const logoutHandler = makeLogoutHandler();
const userAuthStatusVerifyHandler = makeUserAuthStatusVerifyHandler();
const userEmailVerifyStatusHandler = makeUserEmailVerifyStatusHandler(
  checkUserEmailVerified,
);
const forgotPasswordHandler = makeForgotPasswordHandler(
  createNewKeyForUser,
  sendPasswordResetLink,
);
const verifyResetPasswordKeyHandler = makeVerifyResetPasswordKeyHandler(
  verifyResetPasswordKey,
);
const forgotPasswordResetHandler =
  makeForgotPasswordResetHandler(forgotPasswordReset);

export {
  registrationHandler,
  userVerificationHandler,
  logoutHandler,
  userAuthStatusVerifyHandler,
  userEmailVerifyStatusHandler,
  forgotPasswordHandler,
  verifyResetPasswordKeyHandler,
  forgotPasswordResetHandler,
  errorHandler,
};
