import { AppError } from '../../../../globals/utils/AppError';
import { Response } from 'express';
import { isCelebrateError } from 'celebrate';
import logError from '../../../../globals/utils/logError';

class ErrorHandler {
  public async handleError(err: Error, res?: Response): Promise<void> {
    if (res) {
      if (isCelebrateError(err)) {
        res.status(400).json({ message: 'Invalid Data' });
        logError(err, res);
        return;
      } else if (err.name === 'AuthenticationError') {
        res.status(401).json({ message: 'Login Failed' });
        logError(err, res);
        return;
      } else {
        if (err instanceof AppError) {
          if (err.isOperational) {
            if (err.name === 'key expired') {
              res.redirect(
                `${process.env.FRONTEND_URL}/register?user=link-expired`,
              );

              logError(err, res);

              return;
            }

            res.status(err.httpCode).json({ message: err.name });
            logError(err, res);
            return;
          } else {
            // TODO ??
            res.status(500).json({ message: 'Internal Server Error' });
            logError(err, res);
            return;
          }
        } else {
          // TODO ??
          res.status(500).json({ message: 'Internal Server Error' });
          logError(err, res);
          return;
        }
      }
    }

    logError(err);

    //send mail ??
    //etc...
    // TODO: Proper gracefull exit
  }

  public isTrustedError(error: Error) {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }
}

const makeErrorHandler = () => {
  return new ErrorHandler();
};

export default makeErrorHandler;
