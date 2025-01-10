import { sendEMail } from '../../../globals/config/email';
import formatEmail from '../../../globals/utils/emailTemplates';
import { hashPassword, verifyPassword } from '../../../globals/utils/password';
import { makeTempUserModel, makeUserModel } from '../data-access';
import makeAuthenticateUser from './auth/authenticateUser';
import makeRegisterUser from './auth/registerUser';
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

export { registerUser, verifyUser, authenticateUser };
