import { errorHandler } from '..';
import logError from '../../../../globals/utils/logError';

process.on('uncaughtException', (error: Error) => {
  errorHandler
    .handleError(error)
    .then(() => {
      if (!errorHandler.isTrustedError(error)) {
        console.error(error);
        logError(error);
        process.exit(1);
      }
    })
    .catch((handlingError) => {
      console.error('Error during error handling: ', handlingError);
      process.exit(1);
    });
});
