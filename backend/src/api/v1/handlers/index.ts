import { registerUser, verifyUser } from '../use-cases';
import makeLogoutHandler from './auth/logoutHandler';
import makeRegistrationHandler from './auth/registrationHandler';
import makeUserAuthStatusVerifyHandler from './auth/userAuthStatusVerifyHandler';
import makeUserVerificationHandler from './auth/userVerificationHandler';
import makeErrorHandler from './error/errorHandler';

const errorHandler = makeErrorHandler();

const registrationHandler = makeRegistrationHandler(registerUser);
const userVerificationHandler = makeUserVerificationHandler(verifyUser);
const logoutHandler = makeLogoutHandler();
const userAuthStatusVerifyHandler = makeUserAuthStatusVerifyHandler();

export {
  registrationHandler,
  userVerificationHandler,
  logoutHandler,
  userAuthStatusVerifyHandler,
  errorHandler,
};
