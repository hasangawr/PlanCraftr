import User from '../models/user';
import argon2 from 'argon2';
import { validateToken } from '../utils/jwt';

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const user = await User.findOne({ email });

  if (!user) {
    const hash = await argon2.hash(password);

    const newUser = new User({
      name,
      email,
      authType: 'direct',
      password: hash,
    });

    await newUser.save();

    return { name, email };
  }

  return null;
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
