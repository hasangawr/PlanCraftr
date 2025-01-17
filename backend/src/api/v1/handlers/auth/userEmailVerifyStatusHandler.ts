import { NextFunction, Request, Response } from 'express';

// @desc check whether a user is verified
// @route GET /api/v1/auth/user-email-verified
// @access public
const makeUserEmailVerifyStatusHandler = (
  checkUserEmailVerified: (publicId: string) => Promise<boolean>,
) => {
  const userEmailVerifyStatusHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userVerified = await checkUserEmailVerified(
        req.query.user as string,
      );

      if (userVerified) {
        return res.status(200).json({ message: 'Verified' });
      }

      return res.json({ message: 'Unverified' });
    } catch (error) {
      next(error);
    }
  };

  return userEmailVerifyStatusHandler;
};

export default makeUserEmailVerifyStatusHandler;
