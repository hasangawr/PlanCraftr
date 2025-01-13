import { NextFunction, Request, Response } from 'express';

const makeVerifyResetPasswordKeyHandler = (
  verifyResetPasswordKey: (key: string) => Promise<string | null>,
) => {
  const verifyResetPasswordKeyHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const key = req.query.key;
      const userEmail = await verifyResetPasswordKey(key as string);

      if (userEmail) {
        res.cookie('email', userEmail, {
          httpOnly: process.env.NODE_ENV === 'production',
          secure: process.env.NODE_ENV === 'production',
        });
        res.cookie('key', key, {
          httpOnly: process.env.NODE_ENV === 'production',
          secure: process.env.NODE_ENV === 'production',
        });
        return res.redirect(`${process.env.FRONTEND_URL}/reset-password`);
      }

      return res.redirect(
        `${process.env.FRONTEND_URL}/login?reset-user=expired`,
      );
    } catch (error) {
      next(error);
    }
  };

  return verifyResetPasswordKeyHandler;
};

export default makeVerifyResetPasswordKeyHandler;
