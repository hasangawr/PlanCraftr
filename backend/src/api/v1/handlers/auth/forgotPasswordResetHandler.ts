import { NextFunction, Request, Response } from 'express';

const makeForgotPasswordResetHandler = (
  forgotPasswordReset: (
    email: string,
    key: string,
    newPassword: string,
  ) => Promise<string | null>,
) => {
  const forgotPasswordResetHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userPublicId = await forgotPasswordReset(
        req.cookies['email'],
        req.cookies['key'],
        req.body['password'],
      );

      res.clearCookie('email', { path: '/' });
      res.clearCookie('key', { path: '/' });

      if (userPublicId) {
        return res.status(200).json({ message: 'success' });
      }

      return res.status(400).json({ message: 'expired' });
    } catch (error) {
      res.clearCookie('email', { path: '/' });
      res.clearCookie('key', { path: '/' });
      next(error);
    }
  };

  return forgotPasswordResetHandler;
};

export default makeForgotPasswordResetHandler;
