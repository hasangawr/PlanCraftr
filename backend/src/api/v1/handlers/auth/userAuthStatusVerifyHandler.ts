import { NextFunction, Request, Response } from 'express';

const makeUserAuthStatusVerifyHandler = () => {
  const userAuthStatusVerifyHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (req.isUnauthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (req.isAuthenticated()) {
        return res.status(200).json({ message: 'Authenticated' });
      }
    } catch (error) {
      next(error);
    }
  };

  return userAuthStatusVerifyHandler;
};

export default makeUserAuthStatusVerifyHandler;
