import User, { ISafeUser } from '../models/user';
import argon2 from 'argon2';
import { validateToken } from '../utils/jwt';
import TempUser from '../models/tempUser';
import { formatMail, sendMail } from '../config/email';
import { randomUUID } from 'crypto';

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const user = await User.findOne({ email });
  const tempUser = await TempUser.findOne({ email });

  if (!user && !tempUser) {
    const hash = await argon2.hash(password);

    const newUser = new TempUser({
      name,
      email,
      authType: 'direct',
      password: hash,
    });

    const user = await newUser.save();

    //send email
    const mail = formatMail(
      `${process.env.BASE_API_URL}/auth/verify-email?key=${user.key}`,
      'Click To Verify Email',
    );
    await sendMail(
      '"Admin Team - PlanCraftr" <admin-team@plancraftr.com>',
      email,
      'Verify Email',
      mail,
    );

    return { name, email };
  }

  return null;
};

export const verifyUserEmail = async (key: string) => {
  const tempUser = await TempUser.findOne({ key });

  if (tempUser) {
    const verifiedUser = new User({
      name: tempUser.name,
      email: tempUser.email,
      authType: tempUser.authType,
      password: tempUser.password,
    });

    await verifiedUser.save();

    await tempUser.deleteOne();

    return true;
  }

  return false;
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (user && user.authType !== 'google') {
    const passwordVerified = await argon2.verify(
      user.password as string,
      password,
    );
    if (passwordVerified)
      return { _id: user._id, name: user.name, email, authType: user.authType };
  }
  return null;
};

export const verifyUser = (token: string) => {
  const user = validateToken(token);
  return user;
};

export const getUserByEmail = async (
  email: string,
): Promise<boolean | ISafeUser> => {
  const user = await User.findOne({ email }).select('-password');
  if (user) {
    return user;
  }
  return false;
};

export const getUserByKey = async (key: string) => {
  const user = await User.findOne({ key }).select('-password');
  if (user) {
    return user;
  }
  return false;
};

export const sendPasswordResetLink = async (email: string) => {
  const user = await User.findOne({ email });

  if (user) {
    user.set('key', randomUUID());
    await user.save();

    const mail = formatMail(
      `${process.env.BASE_API_URL}/auth/forgot-password?key=${user.key}`,
      'Click To Reset Password',
    );

    await sendMail(
      '"Admin Team - PlanCraftr" <admin-team@plancraftr.com>',
      user.email,
      'Reset Password',
      mail,
    );

    return true;
  }

  return false;
};

export const checkForgotPasswordInitiated = async (email: string) => {
  const user = await User.findOne({ email });

  if (user && user.key) {
    return true;
  }

  return false;
};

export const resetUserPassword = async (
  email: string,
  password: string,
  key: string,
) => {
  const user = await User.findOne({ email });

  if (user && user.key && user.key === key) {
    const hash = await argon2.hash(password);
    user.password = hash;
    delete user.key;

    await user.save();

    return true;
  }

  return false;
};
