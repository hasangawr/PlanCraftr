import { errorHandler } from '..';

process.on('uncaughtException', (error: Error) => {
  errorHandler
    .handleError(error)
    .then(() => {
      if (!errorHandler.isTrustedError(error)) {
        process.exit(1);
      }
    })
    .catch((handlingError) => {
      console.error('Error during error handling: ', handlingError);
      process.exit(1);
    });
});
