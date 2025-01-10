import { NextFunction, Request, Response } from 'express';

const makeUserVerificationHandler = (
  verifyUser: (key: string) => Promise<{ name: string; email: string }>,
) => {
  const userVerificationHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const key = req.query.key;

    try {
      const verifiedUser = await verifyUser(key as string);
      res.redirect(
        `${process.env.FRONTEND_URL}/login?user=${verifiedUser.email}`,
      );
    } catch (error) {
      next(error);
    }
  };

  return userVerificationHandler;
};

export default makeUserVerificationHandler;
