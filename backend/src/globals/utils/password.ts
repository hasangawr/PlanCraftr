import argon2 from 'argon2';
import { AppError } from './AppError';

const hashPassword = async (password: string) => {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (error) {
    console.error('password hashing failed: ', error);
    throw new AppError(
      'password hashing failed',
      500,
      'password hashing failed',
      false,
    );
  }
};

const verifyPassword = async (hashedPassword: string, rawPassword: string) => {
  try {
    const verified = await argon2.verify(hashedPassword, rawPassword);
    return verified;
  } catch (error) {
    console.error('password verification failed: ', error);
    throw new AppError(
      'password verification failed',
      500,
      'password verification failed',
      false,
    );
  }
};

export { hashPassword, verifyPassword };
