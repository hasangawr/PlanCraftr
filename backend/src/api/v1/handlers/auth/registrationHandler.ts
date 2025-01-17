import { NextFunction, Request, Response } from 'express';
import ITempUser from '../../use-cases/interfaces/ITempUser';

const makeRegistrationHandler = (
  registerUser: (
    name: string,
    email: string,
    password: string,
  ) => Promise<ITempUser>,
) => {
  const registrationHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const registeredUser = await registerUser(
        req.body.name,
        req.body.email,
        req.body.password,
      );

      res.status(201).json(registeredUser);
    } catch (error) {
      next(error);
    }
  };

  return registrationHandler;
};

export default makeRegistrationHandler;
