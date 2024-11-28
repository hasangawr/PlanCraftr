import { Request, Response } from 'express';
import {
  registerUser,
  authenticateUser,
  verifyUser,
} from '../services/authService';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  //REMOVE
  console.log('Registration request');

  try {
    const response = await registerUser(
      req.body.name,
      req.body.email,
      req.body.password,
    );

    if (response) {
      res.json(response).status(201);
    } else {
      res
        .send('User with this email already exist. Use different email')
        .status(409);
    }
  } catch (error) {
    console.log('error: ', error);
    res.send('Registration failed. Try again').status(500);
  }
};

export const authenticate = async (req: Request, res: Response) => {
  try {
    //REMOVE
    console.log('Authentication request - test debugger - new');

    const user = await authenticateUser(req.body.email, req.body.password);

    if (user) {
      const token = generateToken(user.id.toString());
      res.cookie('token', token, {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.json(user).status(200);
    } else {
      res.send('Invalid credentials').status(401);
    }
  } catch (error) {
    console.log(error);
    res.send('Login failed. Try again').status(500);
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    //REMOVE
    console.log('Verification request');

    const token = req.cookies.token;

    console.log('token', token);

    if (!token && req.isUnauthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (token) {
      const decoded = verifyUser(token);
      if (decoded) {
        return res
          .status(200)
          .json({ message: 'Authenticated', user: decoded });
      } else {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    }
    if (req.isAuthenticated()) {
      return res.status(200).json({ message: 'Authenticated' });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const logout = async (req: Request, res: Response) => {
  const sessionID = req.sessionID;
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).send({ message: 'Logout failed' });
    }
    req.sessionStore.destroy(sessionID, (err) => {
      if (err) {
        console.error('Error destroying session on session store:', err);
        return res
          .status(500)
          .send({ message: 'Could not destroy session on session store' });
      }
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).send({ message: 'Could not destroy session' });
        }
        res.clearCookie('connect.sid', { path: '/' }); // Clear the session cookie
        res.status(200).send({ message: 'Logged out successfully' });
      });
    });
  });
};
