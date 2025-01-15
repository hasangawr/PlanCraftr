import { sendEMail, verifyConnection } from '../../../globals/config/email';
import { minutesElapsedTillNowFrom } from '../../../globals/utils/date';
import formatEmail from '../../../globals/utils/emailTemplates';
import { hashPassword, verifyPassword } from '../../../globals/utils/password';
import { makeTempUserModel, makeUserModel } from '../data-access';
import makeAuthenticateUser from './auth/authenticateUser';
import makeCheckUserEmailVerified from './auth/checkUserEmailVerified';
import makeCreateNewKeyForUser from './auth/createNewKeyForUser';
import makeForgotPasswordReset from './auth/forgotPasswordReset';
import makeRegisterUser from './auth/registerUser';
import makeSendPasswordResetLink from './auth/sendPasswordResetLink';
import makeVerifyResetPasswordKey from './auth/verifyResetPasswordKey';
import makeVerifyUser from './auth/verifyUser';

const tempUserModel = makeTempUserModel();
const permUserModel = makeUserModel();

const registerUser = makeRegisterUser(
  tempUserModel,
  permUserModel,
  hashPassword,
  formatEmail,
  verifyConnection,
  sendEMail,
);
const verifyUser = makeVerifyUser(tempUserModel, permUserModel);
const authenticateUser = makeAuthenticateUser(permUserModel, verifyPassword);
const checkUserEmailVerified = makeCheckUserEmailVerified(permUserModel);
const createNewKeyForUser = makeCreateNewKeyForUser(permUserModel);
const sendPasswordResetLink = makeSendPasswordResetLink(
  formatEmail,
  verifyConnection,
  sendEMail,
);
const verifyResetPasswordKey = makeVerifyResetPasswordKey(permUserModel);
const forgotPasswordReset = makeForgotPasswordReset(
  permUserModel,
  hashPassword,
  minutesElapsedTillNowFrom,
);

export {
  registerUser,
  verifyUser,
  authenticateUser,
  checkUserEmailVerified,
  createNewKeyForUser,
  sendPasswordResetLink,
  verifyResetPasswordKey,
  forgotPasswordReset,
};
