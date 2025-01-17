import { Request, Response } from 'express';
import { AppError } from '../../../../globals/utils/AppError';

// TODO - unit tests ??
const makeLogoutHandler = () => {
  const logoutHandler = async (req: Request, res: Response) => {
    const sessionID = req.sessionID;

    if (req.isAuthenticated() && sessionID) {
      req.logout((err) => {
        if (err) {
          throw new AppError('Logout failed', 500, 'Error on logout', false);
        }
        req.sessionStore.destroy(sessionID, (err) => {
          if (err) {
            throw new AppError(
              'Session destroying failed',
              500,
              'Error on destroying session on session store',
              false,
            );
          }
          req.session.destroy((err) => {
            if (err) {
              throw new AppError(
                'Session destroying failed',
                500,
                'Error on destroying session',
                false,
              );
            }
            res.clearCookie('connect.sid', { path: '/' }); // Clear the session cookie
            return res.status(200).json({ message: 'Logged out successfully' });
          });
        });
      });
    } else {
      return res
        .status(400)
        .json({ message: 'User is not logged in currently' });
    }
  };

  return logoutHandler;
};

export default makeLogoutHandler;
