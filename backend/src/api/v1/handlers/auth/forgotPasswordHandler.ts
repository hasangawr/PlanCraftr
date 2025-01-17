import { NextFunction, Request, Response } from 'express';

const makeForgotPasswordHandler = (
  createNewKeyForUser: (email: string) => Promise<string>,
  sendPasswordResetLink: (key: string, email: string) => Promise<void>,
) => {
  const forgotPasswordHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const createdKey = await createNewKeyForUser(req.body.email);

      await sendPasswordResetLink(createdKey, req.body.email);

      return res.status(200).send({ message: 'Password reset link sent' });
    } catch (error) {
      next(error);
    }
  };

  return forgotPasswordHandler;
};

export default makeForgotPasswordHandler;
