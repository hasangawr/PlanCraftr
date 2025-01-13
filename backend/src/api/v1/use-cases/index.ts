import { sendEMail } from '../../../globals/config/email';
import formatEmail from '../../../globals/utils/emailTemplates';
import { hashPassword, verifyPassword } from '../../../globals/utils/password';
import { makeTempUserModel, makeUserModel } from '../data-access';
import makeAuthenticateUser from './auth/authenticateUser';
import makeCheckUserEmailVerified from './auth/checkUserEmailVerified';
import makeCreateNewKeyForUser from './auth/createNewKeyForUser';
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
  sendEMail,
);
const verifyUser = makeVerifyUser(tempUserModel, permUserModel);
const authenticateUser = makeAuthenticateUser(permUserModel, verifyPassword);
const checkUserEmailVerified = makeCheckUserEmailVerified(permUserModel);
const createNewKeyForUser = makeCreateNewKeyForUser(permUserModel);
const sendPasswordResetLink = makeSendPasswordResetLink(formatEmail, sendEMail);
const verifyResetPasswordKey = makeVerifyResetPasswordKey(permUserModel);

export {
  registerUser,
  verifyUser,
  authenticateUser,
  checkUserEmailVerified,
  createNewKeyForUser,
  sendPasswordResetLink,
  verifyResetPasswordKey,
};
